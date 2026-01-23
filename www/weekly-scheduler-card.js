/**
 * Weekly Scheduler Card for Home Assistant
 * A Lovelace card for managing weekly schedules
 */

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

// Utility functions
function slotToTime(slot) {
  const hours = Math.floor(slot / 2);
  const minutes = (slot % 2) * 30;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function timeToSlot(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 2 + Math.floor(minutes / 30);
}

function getCurrentDay() {
  const dayIndex = new Date().getDay();
  const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return DAYS[adjustedIndex];
}

function getCurrentSlot() {
  const now = new Date();
  return now.getHours() * 2 + Math.floor(now.getMinutes() / 30);
}

function getSlotProgress() {
  const now = new Date();
  return (now.getMinutes() % 30) / 30;
}

function createEmptySchedule() {
  return {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };
}

function cloneSchedule(schedule) {
  const clone = createEmptySchedule();
  for (const day of DAYS) {
    clone[day] = (schedule[day] || []).map((block) => ({ ...block }));
  }
  return clone;
}

function getValueAtSlot(schedule, day, slot) {
  for (const block of schedule[day] || []) {
    const blockStart = timeToSlot(block.start);
    const blockEnd = block.end === '00:00' ? 48 : timeToSlot(block.end);
    if (slot >= blockStart && slot < blockEnd) {
      return block.value;
    }
  }
  return null;
}

function addTimeBlock(schedule, day, startSlot, endSlot, value) {
  const newSchedule = cloneSchedule(schedule);
  const start = slotToTime(startSlot);
  const end = endSlot >= 48 ? '00:00' : slotToTime(endSlot);

  // Remove overlapping blocks
  newSchedule[day] = newSchedule[day].filter((block) => {
    const blockStart = timeToSlot(block.start);
    const blockEnd = block.end === '00:00' ? 48 : timeToSlot(block.end);
    return blockEnd <= startSlot || blockStart >= endSlot;
  });

  // Handle partial overlaps from original schedule
  const blocksToAdd = [];
  for (const block of schedule[day] || []) {
    const blockStart = timeToSlot(block.start);
    const blockEnd = block.end === '00:00' ? 48 : timeToSlot(block.end);

    if (blockStart < startSlot && blockEnd > startSlot) {
      blocksToAdd.push({
        start: block.start,
        end: slotToTime(startSlot),
        value: block.value,
      });
    }
    if (blockStart < endSlot && blockEnd > endSlot) {
      blocksToAdd.push({
        start: slotToTime(endSlot),
        end: block.end,
        value: block.value,
      });
    }
  }

  newSchedule[day].push({ start, end, value });
  newSchedule[day].push(...blocksToAdd);
  newSchedule[day].sort((a, b) => timeToSlot(a.start) - timeToSlot(b.start));

  // Merge adjacent blocks with same value
  const merged = [];
  for (const block of newSchedule[day]) {
    if (merged.length === 0) {
      merged.push({ ...block });
      continue;
    }
    const last = merged[merged.length - 1];
    const lastEnd = last.end === '00:00' ? 48 : timeToSlot(last.end);
    const currentStart = timeToSlot(block.start);
    if (lastEnd === currentStart && last.value === block.value) {
      merged[merged.length - 1] = { start: last.start, end: block.end, value: last.value };
    } else {
      merged.push({ ...block });
    }
  }
  newSchedule[day] = merged;

  return newSchedule;
}

function removeTimeBlock(schedule, day, startSlot, endSlot) {
  const newSchedule = cloneSchedule(schedule);
  const updatedBlocks = [];

  for (const block of newSchedule[day] || []) {
    const blockStart = timeToSlot(block.start);
    const blockEnd = block.end === '00:00' ? 48 : timeToSlot(block.end);

    if (blockEnd <= startSlot || blockStart >= endSlot) {
      updatedBlocks.push(block);
      continue;
    }

    if (blockStart < startSlot) {
      updatedBlocks.push({
        start: block.start,
        end: slotToTime(startSlot),
        value: block.value,
      });
    }

    if (blockEnd > endSlot) {
      updatedBlocks.push({
        start: slotToTime(endSlot),
        end: block.end,
        value: block.value,
      });
    }
  }

  newSchedule[day] = updatedBlocks.sort((a, b) => timeToSlot(a.start) - timeToSlot(b.start));
  return newSchedule;
}

function copyDayToOthers(schedule, sourceDay, targetDays) {
  const newSchedule = cloneSchedule(schedule);
  const sourceBlocks = (newSchedule[sourceDay] || []).map((block) => ({ ...block }));

  for (const targetDay of targetDays) {
    if (targetDay !== sourceDay) {
      newSchedule[targetDay] = sourceBlocks.map((block) => ({ ...block }));
    }
  }

  return newSchedule;
}

// Register the card
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'weekly-scheduler-card',
  name: 'Weekly Scheduler Card',
  description: 'A card for managing weekly schedules for input helpers',
  preview: true,
});

class WeeklySchedulerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._schedule = createEmptySchedule();
    this._enabled = true;
    this._helperType = 'input_number';
    this._helperEntity = '';
    this._defaultValue = 50;
    this._selection = { isSelecting: false, startDay: null, startSlot: null, endDay: null, endSlot: null };
    this._currentSlot = getCurrentSlot();
    this._currentDay = getCurrentDay();
    this._timeInterval = null;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateFromEntity();
    this._render();
  }

  getCardSize() {
    return 8;
  }

  connectedCallback() {
    this._startTimeUpdates();
  }

  disconnectedCallback() {
    this._stopTimeUpdates();
  }

  _startTimeUpdates() {
    this._updateCurrentTime();
    this._timeInterval = setInterval(() => {
      this._updateCurrentTime();
      this._render();
    }, 30000);
  }

  _stopTimeUpdates() {
    if (this._timeInterval) {
      clearInterval(this._timeInterval);
    }
  }

  _updateCurrentTime() {
    this._currentSlot = getCurrentSlot();
    this._currentDay = getCurrentDay();
  }

  _updateFromEntity() {
    if (!this._hass || !this._config?.entity) return;

    const entity = this._hass.states[this._config.entity];
    if (!entity) return;

    const attrs = entity.attributes;
    if (attrs.schedule) {
      this._schedule = attrs.schedule;
    }
    if (attrs.helper_type) {
      this._helperType = attrs.helper_type;
    }
    if (attrs.helper_entity) {
      this._helperEntity = attrs.helper_entity;
    }
    this._enabled = entity.state === 'on';
  }

  async _updateSchedule(schedule) {
    if (!this._hass || !this._config?.entity) return;

    this._schedule = schedule;
    this._render();

    try {
      await this._hass.callService('weekly_scheduler', 'set_schedule', {
        entity_id: this._config.entity,
        schedule: schedule,
      });
    } catch (error) {
      console.error('Failed to update schedule:', error);
    }
  }

  async _toggleEnabled() {
    if (!this._hass || !this._config?.entity) return;

    try {
      await this._hass.callService('switch', this._enabled ? 'turn_off' : 'turn_on', {
        entity_id: this._config.entity,
      });
    } catch (error) {
      console.error('Failed to toggle schedule:', error);
    }
  }

  _handleCellMouseDown(day, slot, e) {
    e.preventDefault();
    document.body.style.userSelect = 'none';
    this._selection = {
      isSelecting: true,
      startDay: day,
      startSlot: slot,
      endDay: day,
      endSlot: slot,
    };
    this._render();

    const handleMouseMove = (moveEvent) => {
      const cell = this._getCellFromPoint(moveEvent.clientX, moveEvent.clientY);
      if (cell) {
        this._selection = { ...this._selection, endDay: cell.day, endSlot: cell.slot };
        this._render();
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      this._finishSelection();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  _getCellFromPoint(x, y) {
    const grid = this.shadowRoot.querySelector('.grid-container');
    if (!grid) return null;

    const rect = grid.getBoundingClientRect();
    const labelWidth = 50;
    const headerHeight = 30;
    const gridX = x - rect.left - labelWidth;
    const gridY = y - rect.top - headerHeight;

    if (gridX < 0 || gridY < 0) return null;

    const columnWidth = (rect.width - labelWidth) / 7;
    const rowHeight = (rect.height - headerHeight) / 48;

    const dayIndex = Math.floor(gridX / columnWidth);
    const slot = Math.floor(gridY / rowHeight);

    if (dayIndex < 0 || dayIndex >= 7 || slot < 0 || slot >= 48) return null;

    return { day: DAYS[dayIndex], slot };
  }

  _isCellSelected(day, slot) {
    const sel = this._selection;
    if (!sel.isSelecting || !sel.startDay || sel.startSlot === null) return false;

    const startDayIndex = DAYS.indexOf(sel.startDay);
    const endDayIndex = DAYS.indexOf(sel.endDay);
    const minDayIndex = Math.min(startDayIndex, endDayIndex);
    const maxDayIndex = Math.max(startDayIndex, endDayIndex);

    const dayIndex = DAYS.indexOf(day);
    if (dayIndex < minDayIndex || dayIndex > maxDayIndex) return false;

    const minSlot = Math.min(sel.startSlot, sel.endSlot);
    const maxSlot = Math.max(sel.startSlot, sel.endSlot);

    return slot >= minSlot && slot <= maxSlot;
  }

  _finishSelection() {
    const sel = this._selection;
    if (!sel.startDay || sel.startSlot === null || !sel.endDay || sel.endSlot === null) {
      this._selection = { isSelecting: false, startDay: null, startSlot: null, endDay: null, endSlot: null };
      this._render();
      return;
    }

    const startDayIndex = DAYS.indexOf(sel.startDay);
    const endDayIndex = DAYS.indexOf(sel.endDay);
    const minDayIndex = Math.min(startDayIndex, endDayIndex);
    const maxDayIndex = Math.max(startDayIndex, endDayIndex);
    const days = DAYS.slice(minDayIndex, maxDayIndex + 1);

    const startSlot = Math.min(sel.startSlot, sel.endSlot);
    const endSlot = Math.max(sel.startSlot, sel.endSlot) + 1;

    // Check if any cell has a value
    let hasValue = false;
    for (const day of days) {
      for (let slot = startSlot; slot < endSlot; slot++) {
        if (getValueAtSlot(this._schedule, day, slot) !== null) {
          hasValue = true;
          break;
        }
      }
      if (hasValue) break;
    }

    let newSchedule = cloneSchedule(this._schedule);
    for (const day of days) {
      if (hasValue) {
        newSchedule = removeTimeBlock(newSchedule, day, startSlot, endSlot);
      } else {
        const value = this._helperType === 'input_boolean' ? true : this._defaultValue;
        newSchedule = addTimeBlock(newSchedule, day, startSlot, endSlot, value);
      }
    }

    this._selection = { isSelecting: false, startDay: null, startSlot: null, endDay: null, endSlot: null };
    this._updateSchedule(newSchedule);
  }

  _copyToAll(sourceDay) {
    const newSchedule = copyDayToOthers(this._schedule, sourceDay, DAYS);
    this._updateSchedule(newSchedule);
  }

  _copyToWorkdays(sourceDay) {
    const workdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const newSchedule = copyDayToOthers(this._schedule, sourceDay, workdays);
    this._updateSchedule(newSchedule);
  }

  _clearDay(day) {
    const newSchedule = cloneSchedule(this._schedule);
    newSchedule[day] = [];
    this._updateSchedule(newSchedule);
  }

  _clearAll() {
    this._updateSchedule(createEmptySchedule());
  }

  _render() {
    if (!this._config) return;

    const entity = this._hass?.states[this._config.entity];
    const title = this._config.title || entity?.attributes?.friendly_name || 'Weekly Schedule';
    const currentBlock = entity?.attributes?.current_timeblock;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --grid-bg: var(--card-background-color, #fff);
          --grid-border: var(--divider-color, #e0e0e0);
          --cell-active: var(--primary-color, #03a9f4);
          --cell-hover: var(--secondary-background-color, #f5f5f5);
          --cell-selected: rgba(3, 169, 244, 0.3);
          --now-indicator: var(--error-color, #f44336);
          --text-primary: var(--primary-text-color, #212121);
          --text-secondary: var(--secondary-text-color, #757575);
          --btn-bg: var(--primary-color, #03a9f4);
        }

        .card {
          padding: 16px;
          background: var(--ha-card-background, var(--card-background-color, white));
          border-radius: var(--ha-card-border-radius, 4px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2));
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .title {
          font-size: 18px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .status {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 12px;
          background: var(--success-color, #4caf50);
          color: white;
        }

        .status.disabled {
          background: var(--disabled-color, #9e9e9e);
        }

        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding: 12px;
          background: var(--grid-bg);
          border: 1px solid var(--grid-border);
          border-radius: 4px;
          margin-bottom: 12px;
          align-items: center;
        }

        .section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-label {
          font-size: 12px;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        select, .value-input {
          padding: 6px 10px;
          border: 1px solid var(--grid-border);
          border-radius: 4px;
          font-size: 14px;
          background: var(--grid-bg);
          color: var(--text-primary);
        }

        .value-input {
          width: 60px;
          text-align: center;
        }

        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.2s, opacity 0.2s;
          white-space: nowrap;
        }

        .btn-primary {
          background: var(--btn-bg);
          color: white;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        .btn-secondary {
          background: var(--grid-border);
          color: var(--text-primary);
        }

        .btn-secondary:hover {
          background: var(--text-secondary);
          color: white;
        }

        .toggle-switch {
          position: relative;
          width: 40px;
          height: 20px;
          display: inline-block;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 20px;
        }

        .toggle-slider:before {
          position: absolute;
          content: '';
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        .toggle-switch input:checked + .toggle-slider {
          background-color: var(--btn-bg);
        }

        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .helper-info {
          font-size: 11px;
          color: var(--text-secondary);
          margin-left: auto;
        }

        .divider {
          width: 1px;
          height: 24px;
          background: var(--grid-border);
        }

        .grid-container {
          display: grid;
          grid-template-columns: 50px repeat(7, 1fr);
          grid-template-rows: 30px repeat(48, 1fr);
          gap: 1px;
          background: var(--grid-border);
          border: 1px solid var(--grid-border);
          border-radius: 4px;
          overflow: hidden;
          min-height: 600px;
          max-height: 80vh;
          user-select: none;
        }

        .header-cell {
          background: var(--grid-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          font-size: 12px;
          color: var(--text-primary);
          position: sticky;
          top: 0;
          z-index: 2;
        }

        .header-cell.today {
          background: var(--cell-active);
          color: white;
        }

        .time-label {
          background: var(--grid-bg);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-size: 10px;
          color: var(--text-secondary);
          padding-top: 2px;
          position: sticky;
          left: 0;
          z-index: 1;
        }

        .time-label.even-hour {
          font-weight: 500;
        }

        .cell {
          background: var(--grid-bg);
          position: relative;
          cursor: pointer;
          transition: background-color 0.1s;
          min-height: 12px;
        }

        .cell:hover {
          background: var(--cell-hover);
        }

        .cell.active {
          background: var(--cell-active);
        }

        .cell.active.intensity-low {
          opacity: 0.4;
        }

        .cell.active.intensity-medium {
          opacity: 0.7;
        }

        .cell.active.intensity-high {
          opacity: 1;
        }

        .cell.selected {
          background: var(--cell-selected) !important;
        }

        .now-indicator {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--now-indicator);
          z-index: 3;
          pointer-events: none;
        }

        .corner-cell {
          background: var(--grid-bg);
          position: sticky;
          top: 0;
          left: 0;
          z-index: 3;
        }

        .cell-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 8px;
          color: white;
          font-weight: 500;
          pointer-events: none;
        }

        .current-block {
          margin-top: 12px;
          padding: 8px 12px;
          background: var(--cell-hover);
          border-radius: 4px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .current-block strong {
          color: var(--text-primary);
        }

        .error {
          padding: 16px;
          color: var(--error-color, #f44336);
          text-align: center;
        }

        @media (max-width: 600px) {
          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .section {
            justify-content: space-between;
          }
          .helper-info {
            margin-left: 0;
            text-align: center;
          }
          .divider {
            display: none;
          }
        }
      </style>

      ${!entity ? `<div class="error">Entity not found: ${this._config.entity}</div>` : `
      <ha-card>
        <div class="card">
          <div class="header">
            <div class="title">${title}</div>
            <div class="status ${this._enabled ? '' : 'disabled'}">
              ${this._enabled ? 'Active' : 'Disabled'}
            </div>
          </div>

          <div class="toolbar">
            <div class="section">
              <span class="section-label">Schedule</span>
              <label class="toggle-switch">
                <input type="checkbox" id="enableToggle" ${this._enabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
              <span class="section-label">${this._enabled ? 'On' : 'Off'}</span>
            </div>

            <div class="divider"></div>

            ${this._helperType === 'input_number' ? `
              <div class="section">
                <span class="section-label">Value:</span>
                <input type="number" class="value-input" id="valueInput" value="${this._defaultValue}" min="0" max="100">
              </div>
              <div class="divider"></div>
            ` : ''}

            <div class="section">
              <span class="section-label">Copy from:</span>
              <select id="daySelect">
                ${DAYS.map(day => `<option value="${day}">${DAY_LABELS[day]}</option>`).join('')}
              </select>
            </div>

            <div class="section">
              <button class="btn btn-primary" id="copyAllBtn">Copy to All</button>
              <button class="btn btn-primary" id="copyWorkdaysBtn">Copy to Workdays</button>
            </div>

            <div class="divider"></div>

            <div class="section">
              <button class="btn btn-secondary" id="clearDayBtn">Clear Day</button>
              <button class="btn btn-secondary" id="clearAllBtn">Clear All</button>
            </div>

            <div class="helper-info">
              Controlling: ${this._helperEntity}
            </div>
          </div>

          <div class="grid-container">
            <div class="corner-cell"></div>
            ${DAYS.map(day => `
              <div class="header-cell ${day === this._currentDay ? 'today' : ''}">${DAY_LABELS[day]}</div>
            `).join('')}
            ${Array.from({ length: 48 }, (_, slot) => {
              const time = slotToTime(slot);
              const isEvenHour = slot % 4 === 0;
              const showLabel = slot % 2 === 0;
              return `
                <div class="time-label ${isEvenHour ? 'even-hour' : ''}">${showLabel ? time : ''}</div>
                ${DAYS.map(day => {
                  const value = getValueAtSlot(this._schedule, day, slot);
                  const isActive = value !== null;
                  const isSelected = this._isCellSelected(day, slot);
                  const isNowRow = day === this._currentDay && slot === this._currentSlot;
                  const intensityClass = isActive ? this._getIntensityClass(value) : '';
                  return `
                    <div class="cell ${isActive ? 'active' : ''} ${intensityClass} ${isSelected ? 'selected' : ''}"
                         data-day="${day}" data-slot="${slot}">
                      ${isNowRow ? `<div class="now-indicator" style="top: ${getSlotProgress() * 100}%"></div>` : ''}
                      ${isActive && this._helperType === 'input_number' && typeof value === 'number' ? `<span class="cell-value">${Math.round(value)}</span>` : ''}
                    </div>
                  `;
                }).join('')}
              `;
            }).join('')}
          </div>

          ${currentBlock && this._config.show_current_time !== false ? `
            <div class="current-block">
              Current: <strong>${currentBlock.day}</strong> at
              <strong>${currentBlock.time}</strong>
              ${currentBlock.value !== null ? ` - Value: <strong>${this._helperType === 'input_boolean' ? (currentBlock.value ? 'On' : 'Off') : currentBlock.value}</strong>` : ''}
              ${currentBlock.in_block ? '' : ' (in gap)'}
            </div>
          ` : ''}
        </div>
      </ha-card>
      `}
    `;

    if (entity) {
      this._attachEventListeners();
    }
  }

  _getIntensityClass(value) {
    if (value === null) return '';
    if (typeof value === 'boolean') return value ? 'intensity-high' : '';
    if (value <= 33) return 'intensity-low';
    if (value <= 66) return 'intensity-medium';
    return 'intensity-high';
  }

  _attachEventListeners() {
    const enableToggle = this.shadowRoot.getElementById('enableToggle');
    if (enableToggle) {
      enableToggle.addEventListener('change', () => this._toggleEnabled());
    }

    const valueInput = this.shadowRoot.getElementById('valueInput');
    if (valueInput) {
      valueInput.addEventListener('change', (e) => {
        this._defaultValue = Number(e.target.value);
      });
    }

    const daySelect = this.shadowRoot.getElementById('daySelect');
    const copyAllBtn = this.shadowRoot.getElementById('copyAllBtn');
    const copyWorkdaysBtn = this.shadowRoot.getElementById('copyWorkdaysBtn');
    const clearDayBtn = this.shadowRoot.getElementById('clearDayBtn');
    const clearAllBtn = this.shadowRoot.getElementById('clearAllBtn');

    if (copyAllBtn && daySelect) {
      copyAllBtn.addEventListener('click', () => this._copyToAll(daySelect.value));
    }
    if (copyWorkdaysBtn && daySelect) {
      copyWorkdaysBtn.addEventListener('click', () => this._copyToWorkdays(daySelect.value));
    }
    if (clearDayBtn && daySelect) {
      clearDayBtn.addEventListener('click', () => this._clearDay(daySelect.value));
    }
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => this._clearAll());
    }

    // Attach cell event listeners
    const cells = this.shadowRoot.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.addEventListener('mousedown', (e) => {
        const day = cell.dataset.day;
        const slot = parseInt(cell.dataset.slot, 10);
        this._handleCellMouseDown(day, slot, e);
      });
    });
  }

  static getConfigElement() {
    return document.createElement('weekly-scheduler-card-editor');
  }

  static getStubConfig() {
    return {
      entity: '',
      title: 'Weekly Schedule',
      show_current_time: true,
    };
  }
}

class WeeklySchedulerCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._hass) return;

    const entities = Object.keys(this._hass.states).filter(
      entityId => entityId.startsWith('switch.') && this._hass.states[entityId].attributes.schedule !== undefined
    );

    this.shadowRoot.innerHTML = `
      <style>
        .editor {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }
        .row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        label {
          font-size: 12px;
          font-weight: 500;
          color: var(--secondary-text-color);
        }
        input, select {
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          font-size: 14px;
        }
      </style>
      <div class="editor">
        <div class="row">
          <label>Entity</label>
          <select id="entity">
            <option value="">Select an entity...</option>
            ${entities.map(entity => `
              <option value="${entity}" ${entity === this._config?.entity ? 'selected' : ''}>
                ${this._hass.states[entity].attributes.friendly_name || entity}
              </option>
            `).join('')}
          </select>
        </div>
        <div class="row">
          <label>Title (optional)</label>
          <input type="text" id="title" value="${this._config?.title || ''}" placeholder="Weekly Schedule">
        </div>
        <div class="row">
          <label>
            <input type="checkbox" id="show_current_time" ${this._config?.show_current_time !== false ? 'checked' : ''}>
            Show current time indicator
          </label>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('entity').addEventListener('change', (e) => this._valueChanged('entity', e.target.value));
    this.shadowRoot.getElementById('title').addEventListener('input', (e) => this._valueChanged('title', e.target.value));
    this.shadowRoot.getElementById('show_current_time').addEventListener('change', (e) => this._valueChanged('show_current_time', e.target.checked));
  }

  _valueChanged(key, value) {
    const newConfig = { ...this._config, [key]: value };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('weekly-scheduler-card', WeeklySchedulerCard);
customElements.define('weekly-scheduler-card-editor', WeeklySchedulerCardEditor);
