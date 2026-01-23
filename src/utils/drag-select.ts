/**
 * Drag selection utilities for the schedule grid
 */

import { DayName, SelectionState, DAYS } from '../types';

/**
 * Create initial selection state
 */
export function createSelectionState(): SelectionState {
  return {
    isSelecting: false,
    startDay: null,
    startSlot: null,
    endDay: null,
    endSlot: null,
  };
}

/**
 * Start a selection at a specific cell
 */
export function startSelection(
  day: DayName,
  slot: number
): SelectionState {
  return {
    isSelecting: true,
    startDay: day,
    startSlot: slot,
    endDay: day,
    endSlot: slot,
  };
}

/**
 * Update selection as the user drags
 */
export function updateSelection(
  state: SelectionState,
  day: DayName,
  slot: number
): SelectionState {
  if (!state.isSelecting) {
    return state;
  }
  return {
    ...state,
    endDay: day,
    endSlot: slot,
  };
}

/**
 * End the selection and return the final range
 */
export function endSelection(state: SelectionState): {
  days: DayName[];
  startSlot: number;
  endSlot: number;
} | null {
  if (!state.startDay || state.startSlot === null ||
      !state.endDay || state.endSlot === null) {
    return null;
  }

  const startDayIndex = DAYS.indexOf(state.startDay);
  const endDayIndex = DAYS.indexOf(state.endDay);
  const minDayIndex = Math.min(startDayIndex, endDayIndex);
  const maxDayIndex = Math.max(startDayIndex, endDayIndex);

  const days = DAYS.slice(minDayIndex, maxDayIndex + 1);

  const minSlot = Math.min(state.startSlot, state.endSlot);
  const maxSlot = Math.max(state.startSlot, state.endSlot);

  return {
    days,
    startSlot: minSlot,
    endSlot: maxSlot + 1, // +1 because selection end is inclusive
  };
}

/**
 * Check if a cell is within the current selection
 */
export function isCellSelected(
  state: SelectionState,
  day: DayName,
  slot: number
): boolean {
  if (!state.isSelecting ||
      !state.startDay || state.startSlot === null ||
      !state.endDay || state.endSlot === null) {
    return false;
  }

  const startDayIndex = DAYS.indexOf(state.startDay);
  const endDayIndex = DAYS.indexOf(state.endDay);
  const minDayIndex = Math.min(startDayIndex, endDayIndex);
  const maxDayIndex = Math.max(startDayIndex, endDayIndex);

  const dayIndex = DAYS.indexOf(day);
  if (dayIndex < minDayIndex || dayIndex > maxDayIndex) {
    return false;
  }

  const minSlot = Math.min(state.startSlot, state.endSlot);
  const maxSlot = Math.max(state.startSlot, state.endSlot);

  return slot >= minSlot && slot <= maxSlot;
}

/**
 * Get the cell from a mouse/touch event
 */
export function getCellFromEvent(
  event: MouseEvent | TouchEvent,
  gridElement: HTMLElement
): { day: DayName; slot: number } | null {
  const rect = gridElement.getBoundingClientRect();

  let clientX: number;
  let clientY: number;

  if ('touches' in event) {
    if (event.touches.length === 0) return null;
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  // Calculate relative position
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  // Account for time labels column (first column)
  const labelWidth = 50; // Width of time labels column
  const gridX = x - labelWidth;

  if (gridX < 0) return null;

  // Calculate column (day) - 7 columns
  const columnWidth = (rect.width - labelWidth) / 7;
  const dayIndex = Math.floor(gridX / columnWidth);

  if (dayIndex < 0 || dayIndex >= 7) return null;

  // Account for header row
  const headerHeight = 30;
  const gridY = y - headerHeight;

  if (gridY < 0) return null;

  // Calculate row (slot) - 48 rows
  const rowHeight = (rect.height - headerHeight) / 48;
  const slot = Math.floor(gridY / rowHeight);

  if (slot < 0 || slot >= 48) return null;

  return {
    day: DAYS[dayIndex],
    slot,
  };
}

/**
 * Prevent text selection during drag
 */
export function preventTextSelection(): void {
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
}

/**
 * Restore text selection after drag
 */
export function restoreTextSelection(): void {
  document.body.style.userSelect = '';
  document.body.style.webkitUserSelect = '';
}
