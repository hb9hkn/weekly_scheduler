"""Config flow for Weekly Scheduler integration."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant, callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
)

from .const import (
    CONF_HELPER_ENTITY,
    CONF_HELPER_TYPE,
    DOMAIN,
    HELPER_TYPE_INPUT_BOOLEAN,
    HELPER_TYPE_INPUT_NUMBER,
)

_LOGGER = logging.getLogger(__name__)


def get_available_helpers(hass: HomeAssistant) -> list[str]:
    """Get list of available input_number and input_boolean entities."""
    helpers = []

    # Get all states that are input_number or input_boolean
    for state in hass.states.async_all():
        entity_id = state.entity_id
        if entity_id.startswith("input_number.") or entity_id.startswith(
            "input_boolean."
        ):
            helpers.append(entity_id)

    return sorted(helpers)


def get_helper_type(entity_id: str) -> str | None:
    """Determine the helper type from entity ID."""
    if entity_id.startswith("input_number."):
        return HELPER_TYPE_INPUT_NUMBER
    elif entity_id.startswith("input_boolean."):
        return HELPER_TYPE_INPUT_BOOLEAN
    return None


class WeeklySchedulerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Weekly Scheduler."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors = {}

        if user_input is not None:
            helper_entity = user_input[CONF_HELPER_ENTITY]
            helper_type = get_helper_type(helper_entity)

            if helper_type is None:
                errors["base"] = "invalid_helper"
            else:
                # Check if this helper already has a schedule
                await self.async_set_unique_id(f"{DOMAIN}_{helper_entity}")
                self._abort_if_unique_id_configured()

                # Create the entry
                helper_name = helper_entity.split(".")[-1].replace("_", " ").title()

                return self.async_create_entry(
                    title=f"Schedule: {helper_name}",
                    data={
                        CONF_HELPER_ENTITY: helper_entity,
                        CONF_HELPER_TYPE: helper_type,
                    },
                )

        # Build the schema with available helpers
        available_helpers = get_available_helpers(self.hass)

        if not available_helpers:
            return self.async_abort(reason="no_helpers")

        data_schema = vol.Schema(
            {
                vol.Required(CONF_HELPER_ENTITY): EntitySelector(
                    EntitySelectorConfig(
                        domain=["input_number", "input_boolean"],
                    )
                ),
            }
        )

        return self.async_show_form(
            step_id="user",
            data_schema=data_schema,
            errors=errors,
            description_placeholders={
                "helper_count": str(len(available_helpers)),
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
