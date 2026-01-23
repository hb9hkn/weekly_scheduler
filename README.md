# Weekly Scheduler for Home Assistant

A HACS-compatible Home Assistant custom integration for scheduling `input_number` and `input_boolean` helper entities using an Outlook-style weekly calendar interface.

## Features

- **Visual Weekly Calendar**: Drag-to-select time blocks across a 7-day grid with 30-minute intervals
- **Support for Both Helper Types**:
  - `input_number`: Set specific values for different time periods
  - `input_boolean`: Toggle on/off for specific time periods
- **Gap Inheritance**: When no timeblock is active, the last scheduled value persists
- **Manual Override**: Manual changes to helpers persist until the next scheduled timeblock
- **Copy Functions**: Easily copy schedules between days (to all days or workdays only)
- **Current Time Indicator**: Visual indicator shows the current day and time on the grid
- **Theme Support**: Respects Home Assistant's theme colors

## Installation

### HACS (Recommended)

1. Add this repository to HACS as a custom repository
2. Install "Weekly Scheduler" from HACS
3. Restart Home Assistant

### Manual Installation

1. Copy the `custom_components/weekly_scheduler` folder to your `config/custom_components/` directory
2. Copy `www/weekly-scheduler-card.js` to your `config/www/` directory
3. Add the card resource in your Lovelace configuration:
   ```yaml
   resources:
     - url: /local/weekly-scheduler-card.js
       type: module
   ```
4. Restart Home Assistant

## Setup

1. Go to **Settings** → **Devices & Services**
2. Click **Add Integration**
3. Search for "Weekly Scheduler"
4. Select a helper entity (`input_number` or `input_boolean`) to create a schedule for

## Usage

### Lovelace Card

Add a Weekly Scheduler card to your dashboard:

```yaml
type: custom:weekly-scheduler-card
entity: switch.weekly_schedule_hot_water
title: Hot Water Schedule
show_current_time: true
```

### Card Features

- **Drag to Select**: Click and drag on the grid to select time blocks
- **Toggle Blocks**: Clicking on an existing block removes it; clicking on empty space adds a block
- **Copy Functions**: Use the toolbar to copy a day's schedule to all days or workdays
- **Value Input**: For `input_number` schedules, set the value before creating blocks
- **Enable/Disable**: Toggle the entire schedule on/off without losing the configuration

### Services

The integration provides three services:

#### `weekly_scheduler.set_schedule`
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
```

#### `weekly_scheduler.copy_to_all`
Copy one day's schedule to all seven days:
```yaml
service: weekly_scheduler.copy_to_all
data:
  entity_id: switch.weekly_schedule_hot_water
  source_day: monday
```

#### `weekly_scheduler.copy_to_workdays`
Copy one day's schedule to Monday-Friday:
```yaml
service: weekly_scheduler.copy_to_workdays
data:
  entity_id: switch.weekly_schedule_hot_water
  source_day: monday
```

## Entity Attributes

Each schedule entity exposes the following attributes:

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

### Disable Behavior
- When disabled, the helper keeps its last value
- The schedule remains stored and resumes when re-enabled

## Development

### Building the Frontend

```bash
npm install
npm run build
```

### Project Structure

```
custom_components/weekly_scheduler/
├── __init__.py           # Integration setup
├── manifest.json         # HACS manifest
├── const.py              # Constants
├── config_flow.py        # Add schedule wizard
├── switch.py             # Schedule entity
├── coordinator.py        # Data management & time tracking
├── scheduler.py          # Time calculation engine
├── services.yaml         # Service definitions
└── translations/en.json

www/
└── weekly-scheduler-card.js  # Bundled Lovelace card

src/                      # Frontend source (TypeScript/Lit)
├── weekly-scheduler-card.ts
├── components/
│   ├── schedule-grid.ts
│   └── toolbar.ts
├── utils/
│   ├── time-utils.ts
│   ├── drag-select.ts
│   └── schedule-utils.ts
└── types.ts
```

## License

MIT License
