# Development Context - Weekly Scheduler

**Last Updated:** 2026-01-23
**Repository:** https://github.com/hb9hkn/HA_Weekly_Scheduler
**Latest Commit:** `65facee` - Build TypeScript card with Rollup

---

## Project Status: Phase 3 Complete

### Completed Phases

#### Phase 1: Backend Foundation ✅
- [x] `manifest.json` - HACS manifest with version 1.0.0
- [x] `const.py` - Constants, day names, attribute keys
- [x] `scheduler.py` - Time calculations, gap inheritance, validation
- [x] `coordinator.py` - Data management, time tracking, value application
- [x] `switch.py` - Entity with schedule in attributes

#### Phase 2: Configuration ✅
- [x] `config_flow.py` - Helper selection wizard with entity selector
- [x] `__init__.py` - Setup/unload, service registration
- [x] `services.yaml` - set_schedule, copy_to_all, copy_to_workdays
- [x] `translations/en.json` - English translations

#### Phase 3: Frontend Card ✅
- [x] TypeScript/Lit/Rollup build system configured
- [x] `schedule-grid.ts` - 7-day grid, 48 rows, drag-select
- [x] `toolbar.ts` - Copy buttons, value input, enable toggle
- [x] `weekly-scheduler-card.ts` - Main card with service calls
- [x] Built and minified to `www/weekly-scheduler-card.js`

#### Phase 4: Testing & Polish ⏳ (Not Started)
- [ ] Test timeblock transitions
- [ ] Test gap inheritance
- [ ] Test manual override behavior
- [ ] Test UI drag-select on desktop/mobile
- [ ] Test inline value editing
- [ ] Test current time indicator updates
- [ ] Theme compatibility testing
- [ ] Mobile responsiveness testing

---

## Architecture Summary

```
custom_components/weekly_scheduler/
├── __init__.py           # Integration setup, services
├── manifest.json         # HACS manifest v1.0.0
├── const.py              # Constants
├── config_flow.py        # UI wizard
├── switch.py             # Schedule entity
├── coordinator.py        # Core logic
├── scheduler.py          # Time engine
├── services.yaml         # Service definitions
└── translations/en.json

www/
└── weekly-scheduler-card.js  # Built Lovelace card (minified)

src/                      # TypeScript source
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

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Package type | Custom Integration (HACS) | User requested |
| Value field | Generic `value` field | Works for both number/boolean |
| Schedule scope | One schedule per helper | Simpler mental model |
| UI location | Lovelace Card (full-width) | Outlook-style calendar |
| Boolean mode | On/Off timeblocks | Intuitive toggle behavior |
| Disable behavior | Keep last value | Non-disruptive |
| Schedule UI | Always 7 days + copy buttons | Consistent, no mode switching |
| Manual override | Persists until next timeblock | Allows temporary adjustments |
| Current time | Red "now" indicator line | Visual feedback |

---

## Data Model

**Entity:** `switch.weekly_scheduler_[entry_id]`

**Attributes:**
```json
{
  "schedule": {
    "monday": [{"start": "06:00", "end": "22:00", "value": 70}],
    "tuesday": [],
    ...
  },
  "helper_entity": "input_number.hot_water",
  "helper_type": "input_number",
  "enabled": true,
  "current_timeblock": {
    "day": "monday",
    "time": "14:30",
    "value": 70,
    "in_block": true
  }
}
```

---

## Services

| Service | Parameters | Description |
|---------|------------|-------------|
| `weekly_scheduler.set_schedule` | `entity_id`, `schedule` | Update full schedule |
| `weekly_scheduler.copy_to_all` | `entity_id`, `source_day` | Copy day to all 7 days |
| `weekly_scheduler.copy_to_workdays` | `entity_id`, `source_day` | Copy day to Mon-Fri |

---

## Build Commands

```bash
# Install dependencies
npm install

# Build card (TypeScript → minified JS)
npm run build

# Watch mode for development
npm run watch

# Type check without building
npm run typecheck
```

---

## Git Information

**Remote:** `origin` → `https://github.com/hb9hkn/HA_Weekly_Scheduler.git`
**Branch:** `main`
**User:** `hb9hkn <hb9hkn@users.noreply.github.com>`

**Commits:**
1. `ca2f2b5` - Initial commit (GitHub auto-created)
2. `813440c` - Initial release: Weekly Scheduler for Home Assistant
3. `65facee` - Build TypeScript card with Rollup

---

## Next Steps (Phase 4)

### 1. Install in Home Assistant
```bash
# Copy to HA config
cp -r custom_components/weekly_scheduler /path/to/ha/config/custom_components/
cp www/weekly-scheduler-card.js /path/to/ha/config/www/

# Add card resource to Lovelace
# resources:
#   - url: /local/weekly-scheduler-card.js
#     type: module

# Restart Home Assistant
```

### 2. Test Scenarios
- Create schedule for `input_number` helper → verify value changes
- Create schedule for `input_boolean` helper → verify on/off
- Toggle schedule enable/disable → verify helper keeps last value
- Manually change helper → verify override until next timeblock
- Test drag-select on grid
- Test copy to all / workdays
- Test clear day / clear all
- Verify current time indicator updates

### 3. Known Issues to Verify
- Manual override detection uses heuristic (may need context ID tracking)
- Time listener fires every minute at second=0
- Storage persists to `.storage/weekly_scheduler.[entry_id]`

### 4. Potential Enhancements (Future)
- Different values per timeblock (not just one default)
- Undo/redo for schedule changes
- Import/export schedule as JSON
- Multiple schedules per helper (weekday vs weekend profiles)
- Integration with calendar for holiday schedules

---

## File Sizes

| File | Size |
|------|------|
| `www/weekly-scheduler-card.js` | ~45KB (minified with Lit) |
| `custom_components/weekly_scheduler/` | ~25KB total |

---

## Dependencies

**Python (Home Assistant):**
- No external dependencies (uses HA core only)

**JavaScript (Build):**
- `lit` ^3.1.0
- `rollup` ^4.9.0
- `@rollup/plugin-typescript` ^11.1.6
- `@rollup/plugin-node-resolve` ^15.2.3
- `@rollup/plugin-terser` ^0.4.4
- `typescript` ^5.3.3
- `tslib` ^2.6.2

---

## How to Resume Development

1. **Open project:**
   ```bash
   cd /home/msustic/Projects/Schedule
   ```

2. **Check status:**
   ```bash
   git status
   git log --oneline -5
   ```

3. **Make changes and rebuild:**
   ```bash
   npm run build
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Description"
   git push
   ```

5. **If token expired**, generate new GitHub PAT and use:
   ```bash
   git push https://hb9hkn:NEW_TOKEN@github.com/hb9hkn/HA_Weekly_Scheduler.git main
   ```

---

## Contact / Notes

- GitHub repo is public
- HACS compatible (has `hacs.json`)
- MIT License
