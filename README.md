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
- Granular permissions for admin vs. regular user dashboards
- Mobile edit mode with auto-lock to prevent accidental changes

### Card Configuration

```yaml
type: custom:weekly-scheduler-card
helper_entity: input_number.bedroom_temperature
title: Bedroom Temperature Schedule
```

### Card Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `helper_entity` | string | Yes* | - | The helper entity to schedule (`input_number.*` or `input_boolean.*`) |
| `entity` | string | Yes* | - | Legacy: Direct schedule switch entity ID |
| `title` | string | No | Entity name | Card title displayed in the header |
| `schedule_toggle` | boolean | No | `true` | Show the enable/disable schedule toggle |
| `edit_schedule` | boolean | No | `true` | Allow grid interactions, value input, and copy buttons |

*Either `helper_entity` (recommended) or `entity` (legacy) is required.

### Card Permissions

Permissions let you control which actions are available on each card instance. This is useful for creating separate dashboards for admin and regular users.

| Permission | Default | Controls |
|------------|---------|----------|
| `schedule_toggle` | `true` | The on/off switch for the schedule |
| `edit_schedule` | `true` | Grid drag interactions, value input, and copy buttons |

- All permissions default to `true` — existing cards are unaffected
- When both are disabled, the card becomes a clean read-only visualization
- Configurable via the card editor UI (checkboxes) or in YAML

**Example: read-only card for regular users:**
```yaml
type: custom:weekly-scheduler-card
helper_entity: input_number.thermostat_setpoint
title: Thermostat Schedule
schedule_toggle: false
edit_schedule: false
```

### Mobile Edit Mode

On mobile screens (viewport < 600px), the card activates a safety mode to prevent accidental schedule changes from touch interactions.

- **Edit Mode OFF** (default): The schedule grid is locked. The schedule on/off toggle remains accessible.
- **Edit Mode ON**: The toolbar appears and the grid becomes interactive.
- **Auto-lock**: After 30 seconds of no interaction, edit mode turns off automatically.
- On desktop, all permitted controls are always visible (no edit mode toggle).

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
- Default values: **0** for `input_number`, **OFF** for `input_boolean`

### Manual Override

- If you manually change the helper value, it persists until the next scheduled timeblock starts
- This allows temporary adjustments without modifying the schedule

### Enable/Disable

- Turn the switch off to disable the schedule without losing the configuration
- When disabled, the helper keeps its current value
- Turn the switch on to resume scheduled control

## License

MIT License
