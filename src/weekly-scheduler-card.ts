/**
 * Weekly Scheduler Card - Main Lovelace card component
 */

import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  HomeAssistant,
  CardConfig,
  WeeklySchedule,
  DayName,
  DAYS,
} from './types';
import {
  addTimeBlock,
  removeTimeBlock,
  cloneSchedule,
  copyDayToOthers,
  createEmptySchedule,
} from './utils/schedule-utils';
import './components/schedule-grid';
import './components/toolbar';

// Register with Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'weekly-scheduler-card',
  name: 'Weekly Scheduler Card',
  description: 'A card for managing weekly schedules for input helpers',
  preview: true,
});

@customElement('weekly-scheduler-card')
export class WeeklySchedulerCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Object }) config?: CardConfig;

  @state() private _schedule: WeeklySchedule = createEmptySchedule();
  @state() private _enabled: boolean = true;
  @state() private _helperType: 'input_number' | 'input_boolean' = 'input_number';
  @state() private _helperEntity: string = '';
  @state() private _currentValue: number = 50;
  @state() private _defaultValue: number = 50;

  static styles = css`
    :host {
      display: block;
    }

    .card {
      padding: 16px;
      background: var(--ha-card-background, var(--card-background-color, white));
      border-radius: var(--ha-card-border-radius, 4px);
      box-shadow: var(
        --ha-card-box-shadow,
        0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 1px 5px 0 rgba(0, 0, 0, 0.12),
        0 3px 1px -2px rgba(0, 0, 0, 0.2)
      );
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
      color: var(--primary-text-color);
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

    .error {
      padding: 16px;
      color: var(--error-color, #f44336);
      text-align: center;
    }

    .current-block {
      margin-top: 12px;
      padding: 8px 12px;
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }

    .current-block strong {
      color: var(--primary-text-color);
    }
  `;

  setConfig(config: CardConfig) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
    this.config = config;
  }

  getCardSize(): number {
    return 8;
  }

  updated(changedProps: PropertyValues) {
    super.updated(changedProps);

    if (changedProps.has('hass') && this.hass && this.config) {
      this._updateFromEntity();
    }
  }

  private _updateFromEntity() {
    if (!this.hass || !this.config?.entity) return;

    const entity = this.hass.states[this.config.entity] as any;
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

    // Get current value from the helper entity
    if (this._helperEntity && this.hass.states[this._helperEntity]) {
      const helperState = this.hass.states[this._helperEntity];
      if (this._helperType === 'input_number') {
        this._currentValue = parseFloat(helperState.state as string) || 0;
      }
    }
  }

  private async _updateSchedule(schedule: WeeklySchedule) {
    if (!this.hass || !this.config?.entity) return;

    this._schedule = schedule;

    try {
      await this.hass.callService('weekly_scheduler', 'set_schedule', {
        entity_id: this.config.entity,
        schedule: schedule,
      });
    } catch (error) {
      console.error('Failed to update schedule:', error);
    }
  }

  private async _handleSelectionComplete(e: CustomEvent) {
    const { days, startSlot, endSlot, action } = e.detail;

    let newSchedule = cloneSchedule(this._schedule);

    for (const day of days as DayName[]) {
      if (action === 'add') {
        const value =
          this._helperType === 'input_boolean' ? true : this._defaultValue;
        newSchedule = addTimeBlock(newSchedule, day, startSlot, endSlot, value);
      } else {
        newSchedule = removeTimeBlock(newSchedule, day, startSlot, endSlot);
      }
    }

    await this._updateSchedule(newSchedule);
  }

  private async _handleCopyToAll(e: CustomEvent) {
    const { sourceDay } = e.detail;
    const newSchedule = copyDayToOthers(this._schedule, sourceDay, DAYS);
    await this._updateSchedule(newSchedule);
  }

  private async _handleCopyToWorkdays(e: CustomEvent) {
    const { sourceDay } = e.detail;
    const workdays: DayName[] = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
    ];
    const newSchedule = copyDayToOthers(this._schedule, sourceDay, workdays);
    await this._updateSchedule(newSchedule);
  }

  private async _handleClearDay(e: CustomEvent) {
    const { day } = e.detail;
    const newSchedule = cloneSchedule(this._schedule);
    newSchedule[day as DayName] = [];
    await this._updateSchedule(newSchedule);
  }

  private async _handleClearAll() {
    await this._updateSchedule(createEmptySchedule());
  }

  private async _handleToggleEnabled(e: CustomEvent) {
    if (!this.hass || !this.config?.entity) return;

    const { enabled } = e.detail;

    try {
      await this.hass.callService('switch', enabled ? 'turn_on' : 'turn_off', {
        entity_id: this.config.entity,
      });
    } catch (error) {
      console.error('Failed to toggle schedule:', error);
    }
  }

  private _handleValueChange(e: CustomEvent) {
    this._defaultValue = e.detail.value;
  }

  render() {
    if (!this.config) {
      return html`<div class="error">Invalid configuration</div>`;
    }

    if (!this.hass) {
      return html`<div class="error">Home Assistant not available</div>`;
    }

    const entity = this.hass.states[this.config.entity];
    if (!entity) {
      return html`<div class="error">
        Entity not found: ${this.config.entity}
      </div>`;
    }

    const title =
      this.config.title ||
      entity.attributes.friendly_name ||
      'Weekly Schedule';

    const currentBlock = (entity.attributes as any).current_timeblock;

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <div class="title">${title}</div>
            <div class="status ${this._enabled ? '' : 'disabled'}">
              ${this._enabled ? 'Active' : 'Disabled'}
            </div>
          </div>

          <schedule-toolbar
            .enabled=${this._enabled}
            .helperType=${this._helperType}
            .currentValue=${this._currentValue}
            .helperEntity=${this._helperEntity}
            @copy-to-all=${this._handleCopyToAll}
            @copy-to-workdays=${this._handleCopyToWorkdays}
            @clear-day=${this._handleClearDay}
            @clear-all=${this._handleClearAll}
            @toggle-enabled=${this._handleToggleEnabled}
            @value-change=${this._handleValueChange}
          ></schedule-toolbar>

          <schedule-grid
            .schedule=${this._schedule}
            .helperType=${this._helperType}
            .defaultValue=${this._defaultValue}
            @selection-complete=${this._handleSelectionComplete}
          ></schedule-grid>

          ${currentBlock && this.config.show_current_time !== false
            ? html`
                <div class="current-block">
                  Current: <strong>${currentBlock.day}</strong> at
                  <strong>${currentBlock.time}</strong>
                  ${currentBlock.value !== null
                    ? html` - Value:
                        <strong
                          >${this._helperType === 'input_boolean'
                            ? currentBlock.value
                              ? 'On'
                              : 'Off'
                            : currentBlock.value}</strong
                        >`
                    : ''}
                  ${currentBlock.in_block ? '' : ' (in gap)'}
                </div>
              `
            : ''}
        </div>
      </ha-card>
    `;
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

// Simple config editor
@customElement('weekly-scheduler-card-editor')
export class WeeklySchedulerCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Object }) _config?: CardConfig;

  static styles = css`
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

    input,
    select {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      font-size: 14px;
    }
  `;

  setConfig(config: CardConfig) {
    this._config = config;
  }

  private _valueChanged(e: Event) {
    if (!this._config) return;

    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const newConfig = {
      ...this._config,
      [target.name]:
        target.type === 'checkbox'
          ? (target as HTMLInputElement).checked
          : target.value,
    };

    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.hass) return html``;

    // Filter entities to only show weekly_scheduler switches
    const entities = Object.keys(this.hass.states).filter(
      (entityId) =>
        entityId.startsWith('switch.') &&
        this.hass!.states[entityId].attributes.schedule !== undefined
    );

    return html`
      <div class="editor">
        <div class="row">
          <label>Entity</label>
          <select
            name="entity"
            .value=${this._config?.entity || ''}
            @change=${this._valueChanged}
          >
            <option value="">Select an entity...</option>
            ${entities.map(
              (entity) => html`
                <option
                  value="${entity}"
                  ?selected=${entity === this._config?.entity}
                >
                  ${this.hass!.states[entity].attributes.friendly_name ||
                  entity}
                </option>
              `
            )}
          </select>
        </div>

        <div class="row">
          <label>Title (optional)</label>
          <input
            type="text"
            name="title"
            .value=${this._config?.title || ''}
            @input=${this._valueChanged}
            placeholder="Weekly Schedule"
          />
        </div>

        <div class="row">
          <label>
            <input
              type="checkbox"
              name="show_current_time"
              .checked=${this._config?.show_current_time !== false}
              @change=${this._valueChanged}
            />
            Show current time indicator
          </label>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'weekly-scheduler-card': WeeklySchedulerCard;
    'weekly-scheduler-card-editor': WeeklySchedulerCardEditor;
  }
}

// Explicitly register custom elements (backup for decorator issues)
if (!customElements.get('weekly-scheduler-card')) {
  customElements.define('weekly-scheduler-card', WeeklySchedulerCard);
}
if (!customElements.get('weekly-scheduler-card-editor')) {
  customElements.define('weekly-scheduler-card-editor', WeeklySchedulerCardEditor);
}
