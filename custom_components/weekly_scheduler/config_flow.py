"""Config flow for Weekly Scheduler integration."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant, callback
from homeassistant.data_entry_flow import FlowResult

from .const import (
    CONF_HELPER_ENTITY,
    CONF_HELPER_TYPE,
    DOMAIN,
    HELPER_TYPE_INPUT_BOOLEAN,
    HELPER_TYPE_INPUT_NUMBER,
)

_LOGGER = logging.getLogger(__name__)


def get_helper_type(entity_id: str) -> str | None:
    """Determine the helper type from entity ID."""
    if entity_id.startswith("input_number."):
        return HELPER_TYPE_INPUT_NUMBER
    elif entity_id.startswith("input_boolean."):
        return HELPER_TYPE_INPUT_BOOLEAN
    return None


class WeeklySchedulerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Weekly Scheduler."""

    VERSION = 2

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step - simplified, no helper selection."""
        # Check if we already have an entry (only allow one instance)
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            # Create the entry with no helper - schedules are created dynamically
            return self.async_create_entry(
                title="Weekly Scheduler",
                data={},
            )

        # Show confirmation form
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({}),
            description_placeholders={
                "info": "This will install the Weekly Scheduler service. "
                        "Schedules are created from the dashboard card."
            },
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> WeeklySchedulerOptionsFlow:
        """Get the options flow for this handler."""
        return WeeklySchedulerOptionsFlow(config_entry)


class WeeklySchedulerOptionsFlow(config_entries.OptionsFlow):
    """Handle options flow for Weekly Scheduler."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({}),
        )
