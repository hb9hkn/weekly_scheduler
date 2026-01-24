"""Weekly Scheduler integration for Home Assistant."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv

from .const import (
    CONF_HELPER_ENTITY,
    CONF_HELPER_TYPE,
    DAYS,
    DOMAIN,
    SERVICE_COPY_TO_ALL,
    SERVICE_COPY_TO_WORKDAYS,
    SERVICE_SET_SCHEDULE,
    WORKDAYS,
)
from .coordinator import WeeklySchedulerCoordinator
from .scheduler import validate_day_schedule

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.SWITCH]

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


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Weekly Scheduler from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    helper_entity = entry.data.get(CONF_HELPER_ENTITY)
    helper_type = entry.data.get(CONF_HELPER_TYPE)

    _LOGGER.debug(
        "Setting up Weekly Scheduler entry %s: helper_entity=%s, helper_type=%s",
        entry.entry_id,
        helper_entity,
        helper_type,
    )

    if not helper_entity or not helper_type:
        _LOGGER.error(
            "Missing configuration data for entry %s: helper_entity=%s, helper_type=%s",
            entry.entry_id,
            helper_entity,
            helper_type,
        )
        return False

    # Create the coordinator
    coordinator = WeeklySchedulerCoordinator(
        hass,
        entry,
        helper_entity,
        helper_type,
    )

    hass.data[DOMAIN][entry.entry_id] = coordinator

    # Set up platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register services (only once)
    await _async_setup_services(hass)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Stop the coordinator
    coordinator: WeeklySchedulerCoordinator = hass.data[DOMAIN][entry.entry_id]
    await coordinator.async_stop()

    # Unload platforms
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)

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


def _find_coordinator_by_entity(
    hass: HomeAssistant, entity_id: str
) -> WeeklySchedulerCoordinator | None:
    """Find the coordinator for a given switch entity ID."""
    for entry_id, coordinator in hass.data.get(DOMAIN, {}).items():
        # Check if this coordinator's switch matches
        expected_entity = f"switch.weekly_schedule_{coordinator.helper_entity.split('.')[-1]}"
        if entity_id == expected_entity or entity_id == f"switch.{DOMAIN}_{entry_id}":
            return coordinator

        # Also check by matching entry_id in the entity_id
        if entry_id in entity_id:
            return coordinator

    return None
