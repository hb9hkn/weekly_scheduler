"""Switch platform for Weekly Scheduler."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_HELPER_ENTITY, DOMAIN
from .coordinator import WeeklySchedulerCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Weekly Scheduler switch from a config entry."""
    # Store add_entities callback for dynamic entity creation
    hass.data[DOMAIN]["add_entities_callback"] = async_add_entities

    # Create switches for all coordinators
    entities = []
    coordinators = hass.data[DOMAIN].get("coordinators", {})

    for helper_entity, coordinator in coordinators.items():
        # Check if this is a legacy entry (has entry associated)
        if coordinator.entry is not None:
            entities.append(WeeklySchedulerSwitch(coordinator, entry=coordinator.entry))
        else:
            entities.append(WeeklySchedulerSwitch(coordinator))

    if entities:
        async_add_entities(entities)


def get_helper_name(helper_entity: str) -> str:
    """Extract helper name from entity_id."""
    return helper_entity.split(".")[-1]


class WeeklySchedulerSwitch(SwitchEntity):
    """Switch entity representing a weekly schedule."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(
        self,
        coordinator: WeeklySchedulerCoordinator,
        entry: ConfigEntry | None = None,
    ) -> None:
        """Initialize the switch."""
        self.coordinator = coordinator
        self._entry = entry

        # Extract helper name for entity naming
        helper_entity = coordinator.helper_entity
        helper_name = get_helper_name(helper_entity)

        _LOGGER.debug(
            "Initializing switch for helper_entity=%s",
            helper_entity,
        )

        # Entity ID: switch.weekly_schedule_{helper_name}
        # Use helper_entity-based unique_id for consistent entity naming
        self._attr_unique_id = f"{DOMAIN}_{helper_name}"

        # This controls the object_id portion of entity_id
        self.entity_id = f"switch.weekly_schedule_{helper_name}"

        # With has_entity_name=True, setting name to None uses device name as friendly name
        self._attr_name = None
        self._attr_icon = "mdi:calendar-clock"

    @property
    def is_on(self) -> bool:
        """Return true if the schedule is enabled."""
        return self.coordinator.enabled

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return the state attributes."""
        return self.coordinator.get_attributes()

    @property
    def device_info(self) -> DeviceInfo:
        """Return device info."""
        helper_name = get_helper_name(self.coordinator.helper_entity)
        friendly_name = helper_name.replace("_", " ").title()

        return DeviceInfo(
            identifiers={(DOMAIN, helper_name)},
            name=f"Weekly Schedule - {friendly_name}",
            manufacturer="Weekly Scheduler",
            model="Schedule Controller",
            sw_version="0.2.0",
        )

    async def async_added_to_hass(self) -> None:
        """Run when entity is added to hass."""
        await super().async_added_to_hass()

        _LOGGER.debug(
            "Adding switch to hass: helper_entity=%s, helper_type=%s",
            self.coordinator.helper_entity,
            self.coordinator.helper_type,
        )

        # Register callback for coordinator updates
        self.coordinator.set_entity_callback(self._handle_coordinator_update)

        # Start the coordinator
        await self.coordinator.async_start()

        _LOGGER.debug(
            "Switch started successfully for %s",
            self.coordinator.helper_entity,
        )

        # Listen for manual changes to the helper entity
        self.async_on_remove(
            self.hass.bus.async_listen(
                "state_changed",
                self._handle_helper_state_change,
            )
        )

    async def async_will_remove_from_hass(self) -> None:
        """Run when entity is being removed."""
        await self.coordinator.async_stop()
        await super().async_will_remove_from_hass()

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable the schedule."""
        await self.coordinator.async_set_enabled(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable the schedule (keep last value)."""
        await self.coordinator.async_set_enabled(False)

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        self.async_write_ha_state()

    @callback
    def _handle_helper_state_change(self, event) -> None:
        """Handle state changes of the controlled helper entity."""
        if event.data.get("entity_id") != self.coordinator.helper_entity:
            return

        # Check if this was a manual change (not triggered by us)
        old_state = event.data.get("old_state")
        new_state = event.data.get("new_state")

        if old_state is None or new_state is None:
            return

        # If the context indicates it wasn't us, mark as manual override
        # We can detect this by checking if context.parent_id matches our service calls
        # For simplicity, we'll use a heuristic: if change happened outside timeblock boundary
        if self.coordinator.enabled:
            # This is a simplified detection - in production you'd track context IDs
            self.coordinator.mark_manual_override()
            _LOGGER.debug(
                "Detected potential manual change to %s",
                self.coordinator.helper_entity,
            )
