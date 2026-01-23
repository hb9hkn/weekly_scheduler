/**
 * Toolbar component for schedule actions
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DayName, DAYS, DAY_LABELS } from '../types';

@customElement('schedule-toolbar')
export class ScheduleToolbar extends LitElement {
  @property({ type: Boolean }) enabled = true;
  @property({ type: String }) helperType: 'input_number' | 'input_boolean' =
    'input_number';
  @property({ type: Number }) currentValue = 50;
  @property({ type: String }) helperEntity = '';

  @state() private _selectedDay: DayName = 'monday';
  @state() private _inputValue: number = 50;

  static styles = css`
    :host {
      display: block;
      --toolbar-bg: var(--card-background-color, #fff);
      --toolbar-border: var(--divider-color, #e0e0e0);
      --btn-bg: var(--primary-color, #03a9f4);
      --btn-text: white;
      --btn-hover: var(--primary-color, #0288d1);
      --text-primary: var(--primary-text-color, #212121);
      --text-secondary: var(--secondary-text-color, #757575);
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding: 12px;
      background: var(--toolbar-bg);
      border: 1px solid var(--toolbar-border);
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

    .day-select {
      padding: 6px 10px;
      border: 1px solid var(--toolbar-border);
      border-radius: 4px;
      font-size: 14px;
      background: var(--toolbar-bg);
      color: var(--text-primary);
      cursor: pointer;
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
      color: var(--btn-text);
    }

    .btn-primary:hover {
      background: var(--btn-hover);
    }

    .btn-secondary {
      background: var(--toolbar-border);
      color: var(--text-primary);
    }

    .btn-secondary:hover {
      background: var(--text-secondary);
      color: white;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .value-input {
      width: 60px;
      padding: 6px 10px;
      border: 1px solid var(--toolbar-border);
      border-radius: 4px;
      font-size: 14px;
      text-align: center;
    }

    .enable-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toggle-switch {
      position: relative;
      width: 40px;
      height: 20px;
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
      background: var(--toolbar-border);
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
  `;

  private _handleCopyToAll() {
    this.dispatchEvent(
      new CustomEvent('copy-to-all', {
        detail: { sourceDay: this._selectedDay },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleCopyToWorkdays() {
    this.dispatchEvent(
      new CustomEvent('copy-to-workdays', {
        detail: { sourceDay: this._selectedDay },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleClearDay() {
    this.dispatchEvent(
      new CustomEvent('clear-day', {
        detail: { day: this._selectedDay },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleClearAll() {
    this.dispatchEvent(
      new CustomEvent('clear-all', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleToggleEnabled() {
    this.dispatchEvent(
      new CustomEvent('toggle-enabled', {
        detail: { enabled: !this.enabled },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleValueChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this._inputValue = Number(input.value);
  }

  private _handleValueConfirm() {
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { value: this._inputValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleDayChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this._selectedDay = select.value as DayName;
  }

  render() {
    return html`
      <div class="toolbar">
        <!-- Enable/Disable toggle -->
        <div class="section enable-toggle">
          <span class="section-label">Schedule</span>
          <label class="toggle-switch">
            <input
              type="checkbox"
              .checked=${this.enabled}
              @change=${this._handleToggleEnabled}
            />
            <span class="toggle-slider"></span>
          </label>
          <span class="section-label">${this.enabled ? 'On' : 'Off'}</span>
        </div>

        <div class="divider"></div>

        <!-- Value input (for input_number only) -->
        ${this.helperType === 'input_number'
          ? html`
              <div class="section">
                <span class="section-label">Value:</span>
                <input
                  type="number"
                  class="value-input"
                  .value=${String(this._inputValue)}
                  @input=${this._handleValueChange}
                  @change=${this._handleValueConfirm}
                  min="0"
                  max="100"
                />
              </div>
              <div class="divider"></div>
            `
          : ''}

        <!-- Day selection -->
        <div class="section">
          <span class="section-label">Copy from:</span>
          <select class="day-select" @change=${this._handleDayChange}>
            ${DAYS.map(
              (day) => html`
                <option value="${day}" ?selected=${day === this._selectedDay}>
                  ${DAY_LABELS[day]}
                </option>
              `
            )}
          </select>
        </div>

        <!-- Copy buttons -->
        <div class="section">
          <button class="btn btn-primary" @click=${this._handleCopyToAll}>
            Copy to All
          </button>
          <button class="btn btn-primary" @click=${this._handleCopyToWorkdays}>
            Copy to Workdays
          </button>
        </div>

        <div class="divider"></div>

        <!-- Clear buttons -->
        <div class="section">
          <button class="btn btn-secondary" @click=${this._handleClearDay}>
            Clear ${DAY_LABELS[this._selectedDay]}
          </button>
          <button class="btn btn-secondary" @click=${this._handleClearAll}>
            Clear All
          </button>
        </div>

        <!-- Helper info -->
        <div class="helper-info">
          Controlling: ${this.helperEntity}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schedule-toolbar': ScheduleToolbar;
  }
}

// Explicitly register custom element
if (!customElements.get('schedule-toolbar')) {
  customElements.define('schedule-toolbar', ScheduleToolbar);
}
