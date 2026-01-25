"""Weekly Scheduler integration for Home Assistant."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.storage import Store

from .const import (
    CONF_HELPER_ENTITY,
    CONF_HELPER_TYPE,
    DAYS,
    DOMAIN,
    HELPER_TYPE_INPUT_BOOLEAN,
    HELPER_TYPE_INPUT_NUMBER,
    SERVICE_COPY_TO_ALL,
    SERVICE_COPY_TO_WORKDAYS,
    SERVICE_CREATE_SCHEDULE,
    SERVICE_DELETE_SCHEDULE,
    SERVICE_SET_SCHEDULE,
    STORAGE_VERSION,
    WORKDAYS,
)
from .coordinator import WeeklySchedulerCoordinator
from .scheduler import validate_day_schedule

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.SWITCH]

# Storage key for tracking which helpers have schedules
SCHEDULES_REGISTRY_KEY = "weekly_scheduler.registry"
SCHEDULES_REGISTRY_VERSION = 1

# Service schemas
SERVICE_SET_SCHEDULE_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Required("schedule"): dict,
    }
)

SERVICE_COPY_DAY_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Required("source_day"): vol.In(DAYS),
    }
)

SERVICE_CREATE_SCHEDULE_SCHEMA = vol.Schema(
    {
        vol.Required("helper_entity"): cv.entity_id,
        vol.Optional("schedule"): dict,
    }
)

SERVICE_DELETE_SCHEDULE_SCHEMA = vol.Schema(
    {
        vol.Required("helper_entity"): cv.entity_id,
    }
)


def get_helper_type(entity_id: str) -> str | None:
    """Determine the helper type from entity ID."""
    if entity_id.startswith("input_number."):
        return HELPER_TYPE_INPUT_NUMBER
    elif entity_id.startswith("input_boolean."):
        return HELPER_TYPE_INPUT_BOOLEAN
    return None


def get_helper_name(helper_entity: str) -> str:
    """Extract helper name from entity_id."""
    return helper_entity.split(".")[-1]


def get_switch_entity_id(helper_entity: str) -> str:
    """Get the switch entity ID for a helper."""
    helper_name = get_helper_name(helper_entity)
    return f"switch.weekly_schedule_{helper_name}"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Weekly Scheduler from a config entry."""
    # Initialize data structure
    hass.data.setdefault(DOMAIN, {
        "coordinators": {},
        "add_entities_callback": None,
        "entry": entry,
    })

    helper_entity = entry.data.get(CONF_HELPER_ENTITY)
    helper_type = entry.data.get(CONF_HELPER_TYPE)

    # Check if this is a legacy entry (has helper_entity in data)
    is_legacy = helper_entity is not None and helper_type is not None

    if is_legacy:
        _LOGGER.debug(
            "Setting up legacy Weekly Scheduler entry %s: helper_entity=%s",
            entry.entry_id,
            helper_entity,
        )
        # Create coordinator for legacy entry
        coordinator = WeeklySchedulerCoordinator(
            hass,
            helper_entity,
            helper_type,
            entry=entry,
        )
        hass.data[DOMAIN]["coordinators"][helper_entity] = coordinator
    else:
        _LOGGER.debug(
            "Setting up new Weekly Scheduler entry %s (multi-schedule mode)",
            entry.entry_id,
        )
        # Restore coordinators from registry
        await _async_restore_schedules(hass)

    # Set up platforms (switch platform will store add_entities callback)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register services
    await _async_setup_services(hass)

    return True


async def _async_restore_schedules(hass: HomeAssistant) -> None:
    """Restore schedules from registry storage."""
    store = Store(hass, SCHEDULES_REGISTRY_VERSION, SCHEDULES_REGISTRY_KEY)
    data = await store.async_load()

    if not data:
        _LOGGER.debug("No schedule registry found, starting fresh")
        return

    helper_entities = data.get("helper_entities", [])
    _LOGGER.debug("Restoring schedules for helpers: %s", helper_entities)

    for helper_entity in helper_entities:
        helper_type = get_helper_type(helper_entity)
        if helper_type is None:
            _LOGGER.warning(
                "Unknown helper type for %s, skipping restore",
                helper_entity
            )
            continue

        # Create coordinator (it will load its own schedule data)
        coordinator = WeeklySchedulerCoordinator(
            hass,
            helper_entity,
            helper_type,
        )
        hass.data[DOMAIN]["coordinators"][helper_entity] = coordinator
        _LOGGER.debug("Restored coordinator for %s", helper_entity)


async def _async_save_registry(hass: HomeAssistant) -> None:
    """Save the list of helper entities with schedules to registry."""
    store = Store(hass, SCHEDULES_REGISTRY_VERSION, SCHEDULES_REGISTRY_KEY)
    helper_entities = list(hass.data[DOMAIN]["coordinators"].keys())
    await store.async_save({"helper_entities": helper_entities})
    _LOGGER.debug("Saved schedule registry: %s", helper_entities)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Stop all coordinators
    for helper_entity, coordinator in hass.data[DOMAIN]["coordinators"].items():
        await coordinator.async_stop()

    # Unload platforms
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        hass.data.pop(DOMAIN, None)

    return unload_ok


async def _async_setup_services(hass: HomeAssistant) -> None:
    """Set up services for the integration."""

    # Check if services are already registered
    if hass.services.has_service(DOMAIN, SERVICE_SET_SCHEDULE):
        return

    async def handle_set_schedule(call: ServiceCall) -> None:
        """Handle the set_schedule service call."""
        entity_id = call.data["entity_id"]
        schedule = call.data["schedule"]

        # Find the coordinator for this entity
        coordinator = _find_coordinator_by_entity(hass, entity_id)
        if coordinator is None:
            _LOGGER.error("No weekly scheduler found for entity %s", entity_id)
            return

        # Validate the schedule
        for day in DAYS:
            if day in schedule:
                errors = validate_day_schedule(schedule[day])
                if errors:
                    _LOGGER.error("Invalid schedule for %s: %s", day, errors)
                    return

        await coordinator.async_set_schedule(schedule)

    async def handle_copy_to_all(call: ServiceCall) -> None:
        """Handle the copy_to_all service call."""
        entity_id = call.data["entity_id"]
        source_day = call.data["source_day"]

        coordinator = _find_coordinator_by_entity(hass, entity_id)
        if coordinator is None:
            _LOGGER.error("No weekly scheduler found for entity %s", entity_id)
            return

        await coordinator.async_copy_day(source_day, DAYS)

    async def handle_copy_to_workdays(call: ServiceCall) -> None:
        """Handle the copy_to_workdays service call."""
        entity_id = call.data["entity_id"]
        source_day = call.data["source_day"]

        coordinator = _find_coordinator_by_entity(hass, entity_id)
        if coordinator is None:
            _LOGGER.error("No weekly scheduler found for entity %s", entity_id)
            return

        await coordinator.async_copy_day(source_day, WORKDAYS)

    async def handle_create_schedule(call: ServiceCall) -> None:
        """Handle the create_schedule service call."""
        helper_entity = call.data["helper_entity"]
        initial_schedule = call.data.get("schedule")

        # Check if helper entity exists
        if hass.states.get(helper_entity) is None:
            _LOGGER.error("Helper entity %s does not exist", helper_entity)
            return

        # Check if schedule already exists
        if helper_entity in hass.data[DOMAIN]["coordinators"]:
            _LOGGER.warning(
                "Schedule already exists for %s",
                helper_entity
            )
            return

        # Determine helper type
        helper_type = get_helper_type(helper_entity)
        if helper_type is None:
            _LOGGER.error(
                "Invalid helper entity %s (must be input_number or input_boolean)",
                helper_entity
            )
            return

        # Validate initial schedule if provided
        if initial_schedule:
            for day in DAYS:
                if day in initial_schedule:
                    errors = validate_day_schedule(initial_schedule[day])
                    if errors:
                        _LOGGER.error("Invalid schedule for %s: %s", day, errors)
                        return

        # Create coordinator
        coordinator = WeeklySchedulerCoordinator(
            hass,
            helper_entity,
            helper_type,
        )
        hass.data[DOMAIN]["coordinators"][helper_entity] = coordinator

        # Set initial schedule if provided
        if initial_schedule:
            await coordinator.async_set_schedule(initial_schedule)

        # Create switch entity dynamically
        add_entities = hass.data[DOMAIN].get("add_entities_callback")
        if add_entities:
            from .switch import WeeklySchedulerSwitch
            switch = WeeklySchedulerSwitch(coordinator)
            add_entities([switch])
            _LOGGER.info(
                "Created schedule for %s -> %s",
                helper_entity,
                get_switch_entity_id(helper_entity)
            )
        else:
            _LOGGER.error("Cannot create switch entity - add_entities callback not set")
            return

        # Save registry
        await _async_save_registry(hass)

    async def handle_delete_schedule(call: ServiceCall) -> None:
        """Handle the delete_schedule service call."""
        helper_entity = call.data["helper_entity"]

        # Check if schedule exists
        if helper_entity not in hass.data[DOMAIN]["coordinators"]:
            _LOGGER.warning(
                "No schedule exists for %s",
                helper_entity
            )
            return

        # Stop and remove coordinator
        coordinator = hass.data[DOMAIN]["coordinators"].pop(helper_entity)
        await coordinator.async_stop()

        # Remove the switch entity from the entity registry
        from homeassistant.helpers import entity_registry as er
        registry = er.async_get(hass)
        switch_entity_id = get_switch_entity_id(helper_entity)
        entity_entry = registry.async_get(switch_entity_id)
        if entity_entry:
            registry.async_remove(switch_entity_id)
            _LOGGER.info("Removed schedule entity %s", switch_entity_id)

        # Save registry
        await _async_save_registry(hass)

    hass.services.async_register(
        DOMAIN,
        SERVICE_SET_SCHEDULE,
        handle_set_schedule,
        schema=SERVICE_SET_SCHEDULE_SCHEMA,
    )

    hass.services.async_register(
        DOMAIN,
        SERVICE_COPY_TO_ALL,
        handle_copy_to_all,
        schema=SERVICE_COPY_DAY_SCHEMA,
    )

    hass.services.async_register(
        DOMAIN,
        SERVICE_COPY_TO_WORKDAYS,
        handle_copy_to_workdays,
        schema=SERVICE_COPY_DAY_SCHEMA,
    )

    hass.services.async_register(
        DOMAIN,
        SERVICE_CREATE_SCHEDULE,
        handle_create_schedule,
        schema=SERVICE_CREATE_SCHEDULE_SCHEMA,
    )

    hass.services.async_register(
        DOMAIN,
        SERVICE_DELETE_SCHEDULE,
        handle_delete_schedule,
        schema=SERVICE_DELETE_SCHEDULE_SCHEMA,
    )


def _find_coordinator_by_entity(
    hass: HomeAssistant, entity_id: str
) -> WeeklySchedulerCoordinator | None:
    """Find the coordinator for a given switch entity ID."""
    coordinators = hass.data.get(DOMAIN, {}).get("coordinators", {})

    for helper_entity, coordinator in coordinators.items():
        # Check if this coordinator's switch matches
        expected_entity = get_switch_entity_id(helper_entity)
        if entity_id == expected_entity:
            return coordinator

        # Also check by helper entity directly (for backward compat)
        if entity_id == helper_entity:
            return coordinator

    return None
