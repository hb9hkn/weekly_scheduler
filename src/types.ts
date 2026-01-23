/**
 * Type definitions for Weekly Scheduler Card
 */

export interface TimeBlock {
  start: string; // HH:MM format
  end: string; // HH:MM format
  value: number | boolean;
}

export interface WeeklySchedule {
  monday: TimeBlock[];
  tuesday: TimeBlock[];
  wednesday: TimeBlock[];
  thursday: TimeBlock[];
  friday: TimeBlock[];
  saturday: TimeBlock[];
  sunday: TimeBlock[];
}

export type DayName = keyof WeeklySchedule;

export const DAYS: DayName[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const DAY_LABELS: Record<DayName, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

export interface CurrentTimeBlock {
  day: DayName;
  time: string;
  value: number | boolean | null;
  in_block: boolean;
}

export interface SchedulerEntityAttributes {
  schedule: WeeklySchedule;
  helper_entity: string;
  helper_type: 'input_number' | 'input_boolean';
  enabled: boolean;
  current_timeblock: CurrentTimeBlock | null;
  friendly_name?: string;
}

export interface SchedulerEntity {
  entity_id: string;
  state: 'on' | 'off';
  attributes: SchedulerEntityAttributes;
}

export interface CardConfig {
  type: string;
  entity: string;
  title?: string;
  show_current_time?: boolean;
}

export interface HomeAssistant {
  states: Record<string, SchedulerEntity>;
  callService: (
    domain: string,
    service: string,
    data: Record<string, unknown>
  ) => Promise<void>;
  connection: {
    subscribeEvents: (
      callback: (event: unknown) => void,
      eventType: string
    ) => Promise<() => void>;
  };
}

export interface SelectionState {
  isSelecting: boolean;
  startDay: DayName | null;
  startSlot: number | null;
  endDay: DayName | null;
  endSlot: number | null;
}

export interface GridCell {
  day: DayName;
  slot: number; // 0-47 (30-min intervals)
  time: string;
  value: number | boolean | null;
  isSelected: boolean;
  isInBlock: boolean;
}
