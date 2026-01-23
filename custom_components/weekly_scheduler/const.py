"""Constants for Weekly Scheduler integration."""

DOMAIN = "weekly_scheduler"

# Configuration keys
CONF_HELPER_ENTITY = "helper_entity"
CONF_HELPER_TYPE = "helper_type"
CONF_SCHEDULE = "schedule"
CONF_ENABLED = "enabled"

# Helper types
HELPER_TYPE_INPUT_NUMBER = "input_number"
HELPER_TYPE_INPUT_BOOLEAN = "input_boolean"

# Days of the week
DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]

WORKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"]
WEEKEND = ["saturday", "sunday"]

# Time constants
MINUTES_PER_SLOT = 30
SLOTS_PER_DAY = 48

# Attribute keys
ATTR_SCHEDULE = "schedule"
ATTR_HELPER_ENTITY = "helper_entity"
ATTR_HELPER_TYPE = "helper_type"
ATTR_ENABLED = "enabled"
ATTR_CURRENT_TIMEBLOCK = "current_timeblock"

# Service names
SERVICE_SET_SCHEDULE = "set_schedule"
SERVICE_COPY_TO_ALL = "copy_to_all"
SERVICE_COPY_TO_WORKDAYS = "copy_to_workdays"

# Storage
STORAGE_KEY = "weekly_scheduler"
STORAGE_VERSION = 1

# Default schedule (empty)
DEFAULT_SCHEDULE = {
    "monday": [],
    "tuesday": [],
    "wednesday": [],
    "thursday": [],
    "friday": [],
    "saturday": [],
    "sunday": [],
}
