"""Data coordinator for Weekly Scheduler."""

from __future__ import annotations

import logging
from datetime import datetime
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.storage import Store

from .const import (
    ATTR_CURRENT_TIMEBLOCK,
    ATTR_ENABLED,
    ATTR_HELPER_ENTITY,
    ATTR_HELPER_TYPE,
    ATTR_SCHEDULE,
    DEFAULT_SCHEDULE,
    DOMAIN,
    HELPER_TYPE_INPUT_BOOLEAN,
    HELPER_TYPE_INPUT_NUMBER,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .scheduler import (
    find_active_timeblock,
    get_current_day_name,
    get_current_time_str,
    get_effective_value,
    is_at_timeblock_boundary,
)

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

_LOGGER = logging.getLogger(__name__)


class WeeklySchedulerCoordinator:
    """Coordinator for managing a weekly schedule."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        helper_entity: str,
        helper_type: str,
    ) -> None:
        """Initialize the coordinator."""
        self.hass = hass
        self.entry = entry
        self.helper_entity = helper_entity
        self.helper_type = helper_type
        self._schedule: dict[str, list[dict[str, Any]]] = DEFAULT_SCHEDULE.copy()
        self._enabled: bool = True
        self._manual_override: bool = False
        self._last_applied_value: Any = None
        self._store: Store = Store(
            hass, STORAGE_VERSION, f"{STORAGE_KEY}.{entry.entry_id}"
        )
        self._unsub_time_listener: callable | None = None
        self._entity_callback: callable | None = None

    @property
    def schedule(self) -> dict[str, list[dict[str, Any]]]:
        """Return the current schedule."""
        return self._schedule

    @property
    def enabled(self) -> bool:
        """Return whether the schedule is enabled."""
        return self._enabled

    @property
    def current_timeblock(self) -> dict[str, Any] | None:
        """Get current timeblock info for display."""
        day = get_current_day_name()
        current_time = get_current_time_str()
        active_block = find_active_timeblock(self._schedule, day, current_time)

        if active_block:
            return {
                "day": day,
                "time": current_time,
                "value": active_block.get("value"),
                "in_block": True,
            }

        value, _ = get_effective_value(self._schedule, day, current_time)
        return {
            "day": day,
            "time": current_time,
            "value": value,
            "in_block": False,
        }

    async def async_load(self) -> None:
        """Load saved data from storage."""
        data = await self._store.async_load()
        if data:
            self._schedule = data.get("schedule", DEFAULT_SCHEDULE.copy())
            self._enabled = data.get("enabled", True)
            _LOGGER.debug(
                "Loaded schedule for %s: enabled=%s", self.helper_entity, self._enabled
            )

    async def async_save(self) -> None:
        """Save data to storage."""
        await self._store.async_save(
            {
                "schedule": self._schedule,
                "enabled": self._enabled,
            }
        )

    def set_entity_callback(self, callback: callable) -> None:
        """Set callback to notify entity of updates."""
        self._entity_callback = callback

    def _notify_entity(self) -> None:
        """Notify the entity that data has changed."""
        if self._entity_callback:
            self._entity_callback()

    async def async_set_schedule(
        self, schedule: dict[str, list[dict[str, Any]]]
    ) -> None:
        """Update the schedule."""
        self._schedule = schedule
        await self.async_save()
        self._notify_entity()
        # Immediately check if we need to apply a value
        await self._async_check_and_apply()

    async def async_set_enabled(self, enabled: bool) -> None:
        """Enable or disable the schedule."""
        self._enabled = enabled
        await self.async_save()
        self._notify_entity()
        if enabled:
            await self._async_check_and_apply()

    async def async_copy_day(self, source_day: str, target_days: list[str]) -> None:
        """Copy schedule from one day to other days."""
        source_schedule = self._schedule.get(source_day, [])
        for target_day in target_days:
            # Deep copy the blocks
            self._schedule[target_day] = [block.copy() for block in source_schedule]
        await self.async_save()
        self._notify_entity()

    def mark_manual_override(self) -> None:
        """Mark that the helper was manually changed."""
        if self._enabled:
            self._manual_override = True
            _LOGGER.debug("Manual override detected for %s", self.helper_entity)

    async def async_start(self) -> None:
        """Start the time tracking."""
        await self.async_load()

        # Track time changes every minute (at second 0)
        self._unsub_time_listener = async_track_time_change(
            self.hass, self._async_time_changed, second=0
        )

        # Do initial check
        await self._async_check_and_apply()

    async def async_stop(self) -> None:
        """Stop the time tracking."""
        if self._unsub_time_listener:
            self._unsub_time_listener()
            self._unsub_time_listener = None

    @callback
    async def _async_time_changed(self, now: datetime) -> None:
        """Handle time change - check if we need to apply a value."""
        await self._async_check_and_apply()

    async def _async_check_and_apply(self) -> None:
        """Check schedule and apply value if needed."""
        if not self._enabled:
            return

        day = get_current_day_name()
        current_time = get_current_time_str()

        # Check if we're at a timeblock boundary
        at_boundary = is_at_timeblock_boundary(self._schedule, day, current_time)

        # Clear manual override at timeblock boundaries
        if at_boundary and self._manual_override:
            _LOGGER.debug(
                "Clearing manual override at boundary for %s", self.helper_entity
            )
            self._manual_override = False

        # Don't apply if manual override is active
        if self._manual_override:
            return

        # Get the effective value
        value, active_block = get_effective_value(self._schedule, day, current_time)

        if value is None:
            return

        # Only apply if value changed or at boundary
        if at_boundary or value != self._last_applied_value:
            await self._async_apply_value(value)
            self._last_applied_value = value

        self._notify_entity()

    async def _async_apply_value(self, value: Any) -> None:
        """Apply a value to the helper entity."""
        helper_state = self.hass.states.get(self.helper_entity)
        if helper_state is None:
            _LOGGER.warning("Helper entity %s not found", self.helper_entity)
            return

        try:
            if self.helper_type == HELPER_TYPE_INPUT_NUMBER:
                await self.hass.services.async_call(
                    "input_number",
                    "set_value",
                    {"entity_id": self.helper_entity, "value": float(value)},
                )
                _LOGGER.debug(
                    "Applied value %s to %s", value, self.helper_entity
                )
            elif self.helper_type == HELPER_TYPE_INPUT_BOOLEAN:
                service = "turn_on" if value else "turn_off"
                await self.hass.services.async_call(
                    "input_boolean",
                    service,
                    {"entity_id": self.helper_entity},
                )
                _LOGGER.debug(
                    "Applied %s to %s", service, self.helper_entity
                )
        except Exception as ex:
            _LOGGER.error(
                "Failed to apply value to %s: %s", self.helper_entity, ex
            )

    def get_attributes(self) -> dict[str, Any]:
        """Get attributes for the switch entity."""
        return {
            ATTR_SCHEDULE: self._schedule,
            ATTR_HELPER_ENTITY: self.helper_entity,
            ATTR_HELPER_TYPE: self.helper_type,
            ATTR_ENABLED: self._enabled,
            ATTR_CURRENT_TIMEBLOCK: self.current_timeblock,
        }
