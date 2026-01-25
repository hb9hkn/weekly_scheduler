# Weekly Scheduler Integration for Home Assistant

A HACS-compatible Home Assistant custom integration for scheduling `input_number` and `input_boolean` helper entities with a weekly schedule.

## Screenshots

<p align="center">
  <img src="images/number_helper_schedule.png" width="400" alt="Number Helper Schedule">
  <img src="images/boolean_helper_schedule.png" width="400" alt="Boolean Helper Schedule">
</p>

## Features

- **Multi-Schedule Support**: Create independent schedules for multiple helper entities
- **Weekly Scheduling**: Create schedules with 30-minute intervals across 7 days
- **Support for Both Helper Types**:
  - `input_number`: Set specific values for different time periods
  - `input_boolean`: Toggle on/off for specific time periods
- **Gap Inheritance**: When no timeblock is active, the last scheduled value persists
- **Manual Override**: Manual changes to helpers persist until the next scheduled timeblock
- **Copy Functions**: Easily copy schedules between days via services
- **Persistent Storage**: Schedules survive Home Assistant restarts
- **Dynamic Schedule Creation**: Create and delete schedules on-the-fly via services

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
4. Click **Submit** to install the integration

The integration installs as a service-only component. Schedules are created dynamically when you add cards or call the `create_schedule` service.

## Frontend Card

For a visual Outlook-style calendar interface, install the companion Lovelace card:

**[Weekly Scheduler Card](https://github.com/hb9hkn/weekly_scheduler_card)**

The card provides:
- Visual drag-to-select schedule editor
- Automatic schedule creation for new helpers
- Helper entity dropdown for easy configuration

## Services

The integration provides the following services:

### `weekly_scheduler.create_schedule`

Create a new schedule for a helper entity:

```yaml
service: weekly_scheduler.create_schedule
data:
  helper_entity: input_number.bedroom_temperature
```

This creates a switch entity `switch.weekly_schedule_bedroom_temperature` to control the schedule.

### `weekly_scheduler.delete_schedule`

Delete an existing schedule:

```yaml
service: weekly_scheduler.delete_schedule
data:
  helper_entity: input_number.bedroom_temperature
```

### `weekly_scheduler.set_schedule`

Update the complete schedule:

```yaml
service: weekly_scheduler.set_schedule
data:
  entity_id: switch.weekly_schedule_bedroom_temperature
  schedule:
    monday:
      - start: "06:00"
        end: "09:00"
        value: 22
      - start: "17:00"
        end: "22:00"
        value: 21
    tuesday:
      - start: "06:00"
        end: "09:00"
        value: 22
    wednesday: []
    thursday: []
    friday: []
    saturday:
      - start: "08:00"
        end: "23:00"
        value: 20
    sunday:
      - start: "08:00"
        end: "23:00"
        value: 20
```

### `weekly_scheduler.copy_to_all`

Copy one day's schedule to all seven days:

```yaml
service: weekly_scheduler.copy_to_all
data:
  entity_id: switch.weekly_schedule_bedroom_temperature
  source_day: monday
```

### `weekly_scheduler.copy_to_workdays`

Copy one day's schedule to Monday-Friday:

```yaml
service: weekly_scheduler.copy_to_workdays
data:
  entity_id: switch.weekly_schedule_bedroom_temperature
  source_day: monday
```

## Entity Naming

When you create a schedule for a helper entity, a switch entity is created with this naming convention:

| Helper Entity | Switch Entity ID | Friendly Name |
|--------------|------------------|---------------|
| `input_number.bedroom_temp` | `switch.weekly_schedule_bedroom_temp` | Weekly Schedule - Bedroom Temp |
| `input_boolean.vacation_mode` | `switch.weekly_schedule_vacation_mode` | Weekly Schedule - Vacation Mode |

## Entity Attributes

Each schedule switch entity exposes the following attributes:

| Attribute | Description |
|-----------|-------------|
| `schedule` | The complete weekly schedule as JSON |
| `helper_entity` | The controlled helper entity ID |
| `helper_type` | Either `input_number` or `input_boolean` |
| `friendly_name` | Display name for the schedule |

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
- When disabled, the helper keeps its current value
- Turn the switch on to resume scheduled control

## License

MIT License
