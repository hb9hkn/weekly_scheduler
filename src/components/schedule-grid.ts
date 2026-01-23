/**
 * Schedule Grid component
 * Displays the 7-day x 48-slot weekly schedule grid
 */

import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  WeeklySchedule,
  DayName,
  DAYS,
  DAY_LABELS,
  SelectionState,
} from '../types';
import {
  slotToTime,
  getCurrentDay,
  getCurrentSlot,
  getSlotProgress,
} from '../utils/time-utils';
import { getValueAtSlot, isSlotInBlock } from '../utils/schedule-utils';
import {
  createSelectionState,
  startSelection,
  updateSelection,
  endSelection,
  isCellSelected,
  getCellFromEvent,
  preventTextSelection,
  restoreTextSelection,
} from '../utils/drag-select';

@customElement('schedule-grid')
export class ScheduleGrid extends LitElement {
  @property({ type: Object }) schedule: WeeklySchedule = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  @property({ type: String }) helperType: 'input_number' | 'input_boolean' =
    'input_number';

  @property({ type: Number }) defaultValue: number = 50;

  @state() private _selection: SelectionState = createSelectionState();
  @state() private _currentSlot: number = getCurrentSlot();
  @state() private _currentDay: DayName = getCurrentDay();
  @state() private _slotProgress: number = 0;

  private _timeUpdateInterval?: number;

  static styles = css`
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
    }

    .grid-container {
      display: grid;
      grid-template-columns: 50px repeat(7, 1fr);
      grid-template-rows: 30px repeat(48, minmax(14px, 1fr));
      gap: 1px;
      background: var(--grid-border);
      border: 1px solid var(--grid-border);
      border-radius: 4px;
      overflow-y: auto;
      overflow-x: hidden;
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
      min-height: 14px;
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

    .cell.now-row {
      position: relative;
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

    /* Touch improvements */
    @media (pointer: coarse) {
      .cell {
        min-height: 16px;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._startTimeUpdates();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopTimeUpdates();
  }

  private _startTimeUpdates() {
    // Update current time indicator every 30 seconds
    this._updateCurrentTime();
    this._timeUpdateInterval = window.setInterval(() => {
      this._updateCurrentTime();
    }, 30000);
  }

  private _stopTimeUpdates() {
    if (this._timeUpdateInterval) {
      clearInterval(this._timeUpdateInterval);
    }
  }

  private _updateCurrentTime() {
    this._currentSlot = getCurrentSlot();
    this._currentDay = getCurrentDay();
    this._slotProgress = getSlotProgress();
  }

  private _handleMouseDown(e: MouseEvent) {
    const grid = this.shadowRoot?.querySelector('.grid-container');
    if (!grid) return;

    const cell = getCellFromEvent(e, grid as HTMLElement);
    if (!cell) return;

    e.preventDefault();
    preventTextSelection();
    this._selection = startSelection(cell.day, cell.slot);

    // Add document-level listeners for drag
    document.addEventListener('mousemove', this._handleMouseMove);
    document.addEventListener('mouseup', this._handleMouseUp);
  }

  private _handleMouseMove = (e: MouseEvent) => {
    const grid = this.shadowRoot?.querySelector('.grid-container');
    if (!grid) return;

    const cell = getCellFromEvent(e, grid as HTMLElement);
    if (!cell) return;

    this._selection = updateSelection(this._selection, cell.day, cell.slot);
  };

  private _handleMouseUp = () => {
    document.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);
    restoreTextSelection();

    this._finishSelection();
  };

  private _handleTouchStart(e: TouchEvent) {
    const grid = this.shadowRoot?.querySelector('.grid-container');
    if (!grid) return;

    const cell = getCellFromEvent(e, grid as HTMLElement);
    if (!cell) return;

    e.preventDefault();
    this._selection = startSelection(cell.day, cell.slot);
  }

  private _handleTouchMove(e: TouchEvent) {
    const grid = this.shadowRoot?.querySelector('.grid-container');
    if (!grid) return;

    const cell = getCellFromEvent(e, grid as HTMLElement);
    if (!cell) return;

    e.preventDefault();
    this._selection = updateSelection(this._selection, cell.day, cell.slot);
  }

  private _handleTouchEnd() {
    this._finishSelection();
  }

  private _finishSelection() {
    const result = endSelection(this._selection);
    this._selection = createSelectionState();

    if (!result) return;

    // Determine if we should add or remove blocks
    // If any cell in selection has a value, we clear; otherwise we add
    let hasValue = false;
    for (const day of result.days) {
      for (let slot = result.startSlot; slot < result.endSlot; slot++) {
        if (isSlotInBlock(this.schedule, day, slot)) {
          hasValue = true;
          break;
        }
      }
      if (hasValue) break;
    }

    // Dispatch event for parent to handle
    this.dispatchEvent(
      new CustomEvent('selection-complete', {
        detail: {
          days: result.days,
          startSlot: result.startSlot,
          endSlot: result.endSlot,
          action: hasValue ? 'remove' : 'add',
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _getIntensityClass(value: number | boolean | null): string {
    if (value === null) return '';
    if (typeof value === 'boolean') return value ? 'intensity-high' : '';

    // For numbers, calculate intensity based on 0-100 range
    if (value <= 33) return 'intensity-low';
    if (value <= 66) return 'intensity-medium';
    return 'intensity-high';
  }

  private _renderTimeLabel(slot: number) {
    const time = slotToTime(slot);
    const isEvenHour = slot % 4 === 0; // Every 2 hours (4 slots = 2 hours)
    const showLabel = slot % 2 === 0; // Show label every hour

    return html`
      <div class="time-label ${isEvenHour ? 'even-hour' : ''}">
        ${showLabel ? time : html`&nbsp;`}
      </div>
    `;
  }

  private _renderCell(day: DayName, slot: number) {
    const value = getValueAtSlot(this.schedule, day, slot);
    const isActive = value !== null;
    const isSelected = isCellSelected(this._selection, day, slot);
    const isNowRow = day === this._currentDay && slot === this._currentSlot;

    const classes = [
      'cell',
      isActive ? 'active' : '',
      isActive ? this._getIntensityClass(value) : '',
      isSelected ? 'selected' : '',
      isNowRow ? 'now-row' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div class="${classes}" data-day="${day}" data-slot="${slot}">
        ${isNowRow
          ? html`<div
              class="now-indicator"
              style="top: ${this._slotProgress * 100}%"
            ></div>`
          : ''}
        ${isActive && this.helperType === 'input_number' && typeof value === 'number'
          ? html`<span class="cell-value">${Math.round(value)}</span>`
          : ''}
      </div>
    `;
  }

  render() {
    const slots = Array.from({ length: 48 }, (_, i) => i);

    return html`
      <div
        class="grid-container"
        @mousedown=${this._handleMouseDown}
        @touchstart=${this._handleTouchStart}
        @touchmove=${this._handleTouchMove}
        @touchend=${this._handleTouchEnd}
      >
        <!-- Corner cell -->
        <div class="corner-cell"></div>

        <!-- Day headers -->
        ${DAYS.map(
          (day) => html`
            <div class="header-cell ${day === this._currentDay ? 'today' : ''}">
              ${DAY_LABELS[day]}
            </div>
          `
        )}

        <!-- Grid rows -->
        ${slots.map(
          (slot) => html`
            ${this._renderTimeLabel(slot)}
            ${DAYS.map((day) => this._renderCell(day, slot))}
          `
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schedule-grid': ScheduleGrid;
  }
}

// Explicitly register custom element
if (!customElements.get('schedule-grid')) {
  customElements.define('schedule-grid', ScheduleGrid);
}
