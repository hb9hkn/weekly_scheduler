"""Switch platform for Weekly Scheduler."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_HELPER_ENTITY, CONF_HELPER_TYPE, DOMAIN
from .coordinator import WeeklySchedulerCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Weekly Scheduler switch from a config entry."""
    coordinator: WeeklySchedulerCoordinator = hass.data[DOMAIN][entry.entry_id]

    async_add_entities([WeeklySchedulerSwitch(coordinator, entry)])


class WeeklySchedulerSwitch(SwitchEntity):
    """Switch entity representing a weekly schedule."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(
        self,
        coordinator: WeeklySchedulerCoordinator,
        entry: ConfigEntry,
    ) -> None:
        """Initialize the switch."""
        self.coordinator = coordinator
        self._entry = entry
        self._attr_unique_id = f"{DOMAIN}_{entry.entry_id}"

        # Extract helper name for display - use coordinator as source of truth
        helper_entity = coordinator.helper_entity
        if not helper_entity:
            _LOGGER.error(
                "No helper_entity in coordinator for entry %s",
                entry.entry_id,
            )
            helper_entity = entry.data.get(CONF_HELPER_ENTITY, "unknown")

        helper_name = helper_entity.split(".")[-1].replace("_", " ").title() if helper_entity else "Unknown"
        _LOGGER.debug(
            "Initializing switch for entry %s: helper_entity=%s",
            entry.entry_id,
            helper_entity,
        )

        self._attr_name = f"Weekly Schedule - {helper_name}"
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
        return DeviceInfo(
            identifiers={(DOMAIN, self._entry.entry_id)},
            name=self._attr_name,
            manufacturer="Weekly Scheduler",
            model="Schedule Controller",
            sw_version="1.0.0",
        )

    async def async_added_to_hass(self) -> None:
        """Run when entity is added to hass."""
        await super().async_added_to_hass()

        _LOGGER.debug(
            "Adding switch to hass: entry_id=%s, helper_entity=%s, helper_type=%s",
            self._entry.entry_id,
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
