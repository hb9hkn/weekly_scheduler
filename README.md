# Weekly Scheduler Integration for Home Assistant

A HACS-compatible Home Assistant custom integration for scheduling `input_number` and `input_boolean` helper entities with a weekly schedule.

## Features

- **Weekly Scheduling**: Create schedules with 30-minute intervals across 7 days
- **Support for Both Helper Types**:
  - `input_number`: Set specific values for different time periods
  - `input_boolean`: Toggle on/off for specific time periods
- **Gap Inheritance**: When no timeblock is active, the last scheduled value persists
- **Manual Override**: Manual changes to helpers persist until the next scheduled timeblock
- **Copy Functions**: Easily copy schedules between days via services
- **Persistent Storage**: Schedules survive Home Assistant restarts

## Installation

### HACS (Recommended)

1. Add this repository to HACS as a custom repository (category: Integration)
2. Install "Weekly Scheduler" from HACS
3. Restart Home Assistant

### Manual Installation

1. Copy the `custom_components/weekly_scheduler` folder to your `config/custom_components/` directory
2. Restart Home Assistant

## Setup

1. Go to **Settings** > **Devices & Services**
2. Click **Add Integration**
3. Search for "Weekly Scheduler"
4. Select a helper entity (`input_number` or `input_boolean`) to create a schedule for

A switch entity will be created (e.g., `switch.weekly_schedule_hot_water`) that represents the schedule.

## Frontend Card

For a visual Outlook-style calendar interface, install the companion Lovelace card:

**[Weekly Scheduler Card](https://github.com/hb9hkn/weekly_scheduler_card)**

## Services

The integration provides three services:

### `weekly_scheduler.set_schedule`

Update the complete schedule:

```yaml
service: weekly_scheduler.set_schedule
data:
  entity_id: switch.weekly_schedule_hot_water
  schedule:
    monday:
      - start: "06:00"
        end: "22:00"
        value: 70
    tuesday:
      - start: "06:00"
        end: "22:00"
        value: 70
    wednesday: []
    thursday: []
    friday: []
    saturday: []
    sunday: []
```

### `weekly_scheduler.copy_to_all`

Copy one day's schedule to all seven days:

```yaml
service: weekly_scheduler.copy_to_all
data:
  entity_id: switch.weekly_schedule_hot_water
  source_day: monday
```

### `weekly_scheduler.copy_to_workdays`

Copy one day's schedule to Monday-Friday:

```yaml
service: weekly_scheduler.copy_to_workdays
data:
  entity_id: switch.weekly_schedule_hot_water
  source_day: monday
```

## Entity Attributes

Each schedule switch entity exposes the following attributes:

| Attribute | Description |
|-----------|-------------|
| `schedule` | The complete weekly schedule as JSON |
| `helper_entity` | The controlled helper entity ID |
| `helper_type` | Either `input_number` or `input_boolean` |
| `enabled` | Whether the schedule is currently active |
| `current_timeblock` | Info about the current time position |

## Behavior

### Schedule Application

- Values are applied at timeblock boundaries (when a new block starts)
- During gaps (no active timeblock), the last applied value persists
- The schedule checks every minute for timeblock changes

### Manual Override

- If you manually change the helper value, it persists until the next scheduled timeblock starts
- This allows temporary adjustments without modifying the schedule

### Enable/Disable

- Turn the switch off to disable the schedule without losing the configuration
- When disabled, the helper keeps its last value
- Turn the switch on to resume scheduled control

## License

MIT License
