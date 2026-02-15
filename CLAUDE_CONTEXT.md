# Weekly Scheduler - Development Context

**Last Updated:** 2026-02-15
**Current Version (Backend):** 0.5.0
**Current Version (Card):** 0.5.0-beta.6

This file documents the current state of both the backend integration and frontend card repositories for continuing development.

---

## Repository Locations

| Component | Local Path | GitHub URL |
|-----------|-----------|------------|
| Backend (Integration) | `/home/msustic/Projects/Schedule` | https://github.com/hb9hkn/weekly_scheduler |
| Frontend (Card) | `/home/msustic/Projects/weekly_scheduler_card` | https://github.com/hb9hkn/weekly_scheduler_card |

---

## Architecture Overview

```
Multi-Schedule Architecture (v0.2.0+)

OLD (v0.1.x):
  Integration Setup → User selects ONE helper → Creates ONE switch entity

NEW (v0.2.x):
  Integration Setup → Installs service only (no helper selection)
  Card/Service → User selects helper → Calls create_schedule → Switch entity created
  Multiple cards can control different helpers with independent schedules
```

---

## Backend Integration (`custom_components/weekly_scheduler/`)

### File Structure

```
custom_components/weekly_scheduler/
├── __init__.py          # Main integration, services, coordinator management
├── config_flow.py       # Simplified setup (no helper selection), VERSION=2
├── const.py             # Constants, service names, day names, etc.
├── coordinator.py       # WeeklySchedulerCoordinator - manages schedule state & applies values
├── manifest.json        # HACS manifest, version 0.5.0
├── scheduler.py         # Time/schedule utility functions
├── services.yaml        # Service definitions for HA
├── switch.py            # WeeklySchedulerSwitch entity
└── translations/
    └── en.json          # English translations

images/
├── logo.png                    # Project logo for HACS
├── boolean_helper_schedule.png # Screenshot for README
└── number_helper_schedule.png  # Screenshot for README

.github/workflows/
└── validate.yml         # GitHub Actions workflow for HACS validation
```

### Key Components

#### `__init__.py`
- **Data Structure:**
  ```python
  hass.data[DOMAIN] = {
      "coordinators": {helper_entity: coordinator, ...},
      "add_entities_callback": async_add_entities,
      "entry": entry,
  }
  ```
- **Services:**
  - `weekly_scheduler.set_schedule` - Update schedule for a switch entity
  - `weekly_scheduler.copy_to_all` - Copy day to all days
  - `weekly_scheduler.copy_to_workdays` - Copy day to Mon-Fri
  - `weekly_scheduler.create_schedule` - Create schedule for a helper
  - `weekly_scheduler.delete_schedule` - Delete schedule for a helper
- **Registry Persistence:** Saves list of helper entities to `weekly_scheduler.registry` storage

#### `coordinator.py`
- Manages schedule state for a single helper entity
- Applies values to helper entities at timeblock boundaries
- Storage key: `weekly_scheduler.{entry_id}` (legacy) or `weekly_scheduler.{helper_entity.replace(".", "_")}` (new)
- Tracks manual overrides and clears them at timeblock boundaries

#### `switch.py`
- Creates `WeeklySchedulerSwitch` entities
- Entity naming: `switch.weekly_schedule_{helper_name}`
- Stores `add_entities_callback` for dynamic entity creation
- Listens for manual changes to helper entities

#### `config_flow.py`
- VERSION = 2
- Single instance only (no duplicate integrations)
- No helper selection - just confirms installation
- Legacy entries (with `CONF_HELPER_ENTITY` in data) still supported

### Entity Naming Convention

| Helper Entity | Switch Entity ID | Friendly Name |
|--------------|------------------|---------------|
| `input_number.bedroom_temp` | `switch.weekly_schedule_bedroom_temp` | Weekly Schedule - Bedroom Temp |
| `input_boolean.vacation` | `switch.weekly_schedule_vacation` | Weekly Schedule - Vacation |

### Backward Compatibility
- Config entries with `CONF_HELPER_ENTITY` in data are treated as legacy
- Legacy entries create coordinator with entry-based storage key
- New entries use helper_entity-based storage key

---

## Frontend Card (`weekly_scheduler_card/`)

### File Structure

```
weekly_scheduler_card/
├── src/
│   ├── weekly-scheduler-card.ts   # Main card + editor components
│   ├── types.ts                   # TypeScript interfaces
│   ├── components/
│   │   ├── schedule-grid.ts       # 7-day x 48-slot grid component
│   │   └── toolbar.ts             # Value input, copy buttons, enable toggle
│   └── utils/
│       ├── schedule-utils.ts      # Schedule manipulation functions
│       ├── time-utils.ts          # Time conversion utilities
│       └── drag-select.ts         # Mouse drag selection logic
├── dist/                          # (not in repo, gitignored)
├── weekly-scheduler-card.js       # Built output (committed for HACS)
├── package.json
├── rollup.config.js
├── tsconfig.json
└── hacs.json
```

### Key Components

#### `weekly-scheduler-card.ts`
- **WeeklySchedulerCard** - Main card class
  - Supports both `entity` (legacy) and `helper_entity` (new) config
  - Shows "Create Schedule" button if schedule doesn't exist
  - Calls `weekly_scheduler.create_schedule` service
  - **Permission resolution**: `_permissions` getter defaults all to `true` via `!== false` pattern
  - **Mobile detection**: `window.matchMedia('(max-width: 600px)')` — viewport < 600px = mobile
  - **Edit mode**: Mobile-only safety toggle with 30-second auto-lock timer
  - **Mobile bar**: Shows schedule on/off toggle (if `schedule_toggle` permitted) alongside edit mode toggle (if `edit_schedule` permitted)

- **WeeklySchedulerCardEditor** - Card editor
  - Shows dropdown of ALL `input_number.*` and `input_boolean.*` entities
  - Marks entities that already have schedules with "(has schedule)"
  - Title input field
  - Permission checkboxes: `schedule_toggle` and `edit_schedule`

#### `types.ts`
- **CardConfig** - `{ entity?, helper_entity?, title?, show_current_time?, schedule_toggle?, edit_schedule? }`
- **ResolvedPermissions** - `{ schedule_toggle: boolean, edit_schedule: boolean }`
- **WeeklySchedule** - `{ monday: TimeBlock[], ... }`
- **TimeBlock** - `{ start: string, end: string, value: number|boolean }`

#### `schedule-grid.ts`
- **ScheduleGrid** - Interactive 7-day x 48-slot grid
- `editable` property (default `true`) gates all mouse/touch handlers
- When `!editable`: grid renders with `read-only` CSS class, cursor: default

#### `toolbar.ts`
- **ScheduleToolbar** - Action controls
- `permissions` property controls which sections render
- Value input dispatches `value-change` on every keystroke (`@input` event) for live updates
- Default value: 0 (for `input_number`)
- Sections: schedule toggle, value input, day selector + copy buttons

#### Custom Element Registration
All components use guarded explicit registration (NOT decorators):
```typescript
if (!customElements.get('schedule-grid')) {
  customElements.define('schedule-grid', ScheduleGrid);
}
```
This prevents "already been used with this registry" errors on HACS reload.

### Card Configuration

```yaml
# New style (recommended)
type: custom:weekly-scheduler-card
helper_entity: input_number.bedroom_temperature
title: Bedroom Temperature Schedule

# With permissions (restrict controls for regular users)
type: custom:weekly-scheduler-card
helper_entity: input_number.bedroom_temperature
title: Bedroom Temperature Schedule
schedule_toggle: false
edit_schedule: false

# Legacy style (still supported)
type: custom:weekly-scheduler-card
entity: switch.weekly_schedule_bedroom_temperature
title: Bedroom Temperature Schedule
```

### Permission System

Two permission groups (all default to `true` for backward compatibility):

| Permission | Controls |
|------------|----------|
| `schedule_toggle` | Enable/disable switch for the schedule |
| `edit_schedule` | Grid drag interactions, value input, and copy buttons |

When both are `false`: toolbar hidden, grid non-interactive, clean read-only view.

### Mobile Edit Mode

- Triggered when viewport width < 600px (`window.matchMedia`)
- Top bar shows schedule on/off toggle (if `schedule_toggle` true) + edit mode switch (if `edit_schedule` true)
- On mobile, toolbar only shows when edit mode is ON
- Auto-lock: 30 seconds of no interaction → edit mode turns off silently
- Timer resets on any touch, click, or input within the card
- Desktop (>= 600px): no edit mode toggle, all permitted controls always visible

### Build Process

```bash
cd /home/msustic/Projects/weekly_scheduler_card
npm install
npm run build  # Creates weekly-scheduler-card.js
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.4 | 2026-01-24 | Last single-schedule version |
| 0.2.0 | 2026-01-24 | Multi-schedule architecture, create/delete services |
| 0.2.1 | 2026-01-24 | Fix: HassEntity type for helper dropdown |
| 0.2.2 | 2026-01-24 | Fix: Custom element re-registration errors |
| 0.2.6 | 2026-01-24 | Fix: Version upgrade detection with auto-reload |
| 0.3.0 | 2026-01-24 | Documentation update, release cleanup |
| 0.3.1 | 2026-01-24 | Add ON/OFF selector for boolean helpers |
| 0.3.2 | 2026-01-24 | Fix: Old code detection for pre-0.2.6 versions |
| 0.3.3 | 2026-01-24 | Add version banner to built JS for debugging |
| 0.3.4 | 2026-01-24 | UX: Boolean toggle behavior, number overwrite behavior |
| 0.3.5 | 2026-01-25 | Fix: create_schedule accepts schedule param, decimal numbers, responsive UI, time label alignment |
| 0.4.0 | 2026-01-25 | Updated screenshots with latest UI |
| 0.4.1 | 2026-01-25 | Added project logo, fixed hacs.json, added GitHub Actions validation workflow |
| 0.4.2 | 2026-01-25 | Version bump |
| 0.4.3 | 2026-01-25 | Version bump |
| 0.5.0-beta.1 | 2026-02-15 | Granular permissions (4 groups), mobile edit mode with 30s auto-lock |
| 0.5.0-beta.2 | 2026-02-15 | Reverted — attempted config-driven require_edit_mode |
| 0.5.0-beta.3 | 2026-02-15 | Mobile bar: schedule on/off toggle alongside edit mode toggle |
| 0.5.0-beta.4 | 2026-02-15 | Simplified to 2 permission groups, removed clear buttons, default value 0 |
| 0.5.0-beta.5 | 2026-02-15 | Fix: hide Edit Mode switch when edit_schedule is disabled |
| 0.5.0-beta.6 | 2026-02-15 | Value input defaults to 0, live value updates on keystroke |

---

## Common Tasks

### Creating a New Release

```bash
# 1. Update version in manifest.json (backend) and package.json (frontend)

# 2. Build frontend
cd /home/msustic/Projects/weekly_scheduler_card
npm run build

# 3. Commit both repos
cd /home/msustic/Projects/Schedule
git add -A && git commit -m "Description"
git push origin main

cd /home/msustic/Projects/weekly_scheduler_card
git add -A && git commit -m "Description"
git push origin main

# 4. Create tags
git tag -a vX.Y.Z -m "vX.Y.Z" && git push origin vX.Y.Z

# 5. Create GitHub releases
gh release create vX.Y.Z --title "vX.Y.Z" weekly-scheduler-card.js  # card
```

### Creating a Pre-release (Beta)

```bash
# Pre-releases are invisible to regular HACS users
gh release create v0.5.0-beta.N --target feature/permissions-edit-mode \
  --prerelease --title "v0.5.0-beta.N" weekly-scheduler-card.js
```

### Git Remote Authentication

Both repos use personal access token in URL:
```
https://hb9hkn:github_pat_...@github.com/hb9hkn/...
```

---

## Known Issues / Future Work

1. **Current time indicator** - Removed from stub config in v0.2.0, could be re-added
2. **Schedule migration** - When upgrading from v0.1.x, existing schedules work but new cards should use `helper_entity`
3. **Multiple cards same helper** - Not explicitly handled, but should work (same schedule entity)

---

## Testing Checklist

- [ ] Fresh install: Add integration → no helper selection → just confirms
- [ ] Add card: Edit dashboard → add weekly scheduler card → see helper dropdown populated
- [ ] Create schedule: Select helper without schedule → click Create → switch entity appears
- [ ] Use schedule: Schedule grid works, copy buttons work
- [ ] Multiple schedules: Add another card → select different helper → separate schedule
- [ ] Legacy: Existing v0.1.x installations continue working after upgrade
- [ ] Restart: Schedules persist across Home Assistant restarts
- [ ] Browser reload: Card loads without "already been used" errors
- [ ] Permissions: Set `edit_schedule: false` → grid non-interactive, value input and copy hidden
- [ ] Permissions: Set `schedule_toggle: false` → on/off switch hidden
- [ ] Permissions: Both false → toolbar hidden, grid read-only
- [ ] Mobile edit mode: Viewport < 600px → edit mode bar appears
- [ ] Mobile auto-lock: Enable edit mode, wait 30s → auto-locks
- [ ] Mobile schedule toggle: On/off switch in top bar (when permitted)
- [ ] Desktop: No edit mode toggle, all permitted controls visible

All of the above now works.

## Recent Changes (v0.5.0-beta series):

### Frontend:
- **Granular permissions**: 2 config-driven permission groups (`schedule_toggle`, `edit_schedule`) to control which actions are available per card instance
- **Mobile edit mode**: Edit toggle on screens < 600px viewport to prevent accidental touch changes, with 30-second auto-lock
- **Mobile bar**: Schedule on/off toggle shown alongside Edit Mode toggle for easy access without entering edit mode
- **Read-only mode**: When all permissions are disabled, toolbar is hidden and grid is non-interactive
- **Editor UI**: Permission checkboxes added to the card editor
- **Live value input**: Value updates on every keystroke (no need to blur/confirm before dragging)
- **Default value**: 0 for input_number, OFF for input_boolean
- **Removed**: Clear day/all buttons (prevented undefined schedule values)
- **Mobile detection**: Uses `window.matchMedia('(max-width: 600px)')` for viewport-based detection

### Backend:
- No backend changes needed — permissions are purely frontend/config-driven

### Notes:
- Card auto-updates when schedule changes because it reads state from the entity (reactive via hass property)
- Both repos now have HACS validation workflows for automated testing
- Feature branch `feature/permissions-edit-mode` has been merged to `main`
- Both repos released as v0.5.0 on 2026-02-15
- `render_readme` removed from both `hacs.json` files (deprecated in HACS 2.0)
