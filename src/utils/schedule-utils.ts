/**
 * Schedule manipulation utilities
 */

import { TimeBlock, WeeklySchedule, DayName, DAYS } from '../types';
import { slotToTime, timeToSlot } from './time-utils';

/**
 * Create an empty schedule
 */
export function createEmptySchedule(): WeeklySchedule {
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

/**
 * Deep clone a schedule
 */
export function cloneSchedule(schedule: WeeklySchedule): WeeklySchedule {
  const clone: WeeklySchedule = createEmptySchedule();
  for (const day of DAYS) {
    clone[day] = schedule[day].map((block) => ({ ...block }));
  }
  return clone;
}

/**
 * Add or update a timeblock in the schedule
 */
export function addTimeBlock(
  schedule: WeeklySchedule,
  day: DayName,
  startSlot: number,
  endSlot: number,
  value: number | boolean
): WeeklySchedule {
  const newSchedule = cloneSchedule(schedule);
  const start = slotToTime(startSlot);
  const end = endSlot >= 48 ? '00:00' : slotToTime(endSlot);

  // Remove any existing blocks that overlap with this range
  newSchedule[day] = newSchedule[day].filter((block) => {
    const blockStart = timeToSlot(block.start);
    const blockEnd = block.end === '00:00' ? 48 : timeToSlot(block.end);
    // Keep blocks that don't overlap
    return blockEnd <= startSlot || blockStart >= endSlot;
  });

  // Handle blocks that partially overlap
  const blocksToAdd: TimeBlock[] = [];
  for (const block of schedule[day]) {
    const blockStart = timeToSlot(block.start);
    const blockEnd = block.end === '00:00' ? 48 : timeToSlot(block.end);

    // Block starts before our range and ends within or after
    if (blockStart < startSlot && blockEnd > startSlot) {
      blocksToAdd.push({
        start: block.start,
        end: slotToTime(startSlot),
        value: block.value,
      });
    }

    // Block starts within our range and ends after
    if (blockStart < endSlot && blockEnd > endSlot) {
      blocksToAdd.push({
        start: slotToTime(endSlot),
        end: block.end,
        value: block.value,
      });
    }
  }

  // Add the new block
  newSchedule[day].push({ start, end, value });

  // Add any split blocks
  newSchedule[day].push(...blocksToAdd);

  // Sort and merge adjacent blocks
  newSchedule[day] = mergeAdjacentBlocks(
    newSchedule[day].sort((a, b) => timeToSlot(a.start) - timeToSlot(b.start))
  );

  return newSchedule;
}

/**
 * Remove a timeblock (or part of it) from the schedule
 */
export function removeTimeBlock(
  schedule: WeeklySchedule,
  day: DayName,
  startSlot: number,
  endSlot: number
): WeeklySchedule {
  const newSchedule = cloneSchedule(schedule);

  const updatedBlocks: TimeBlock[] = [];

  for (const block of newSchedule[day]) {
    const blockStart = timeToSlot(block.start);
    const blockEnd = block.end === '00:00' ? 48 : timeToSlot(block.end);

    // No overlap - keep the block as is
    if (blockEnd <= startSlot || blockStart >= endSlot) {
      updatedBlocks.push(block);
      continue;
    }

    // Block starts before the removal range
    if (blockStart < startSlot) {
      updatedBlocks.push({
        start: block.start,
        end: slotToTime(startSlot),
        value: block.value,
      });
    }

    // Block ends after the removal range
    if (blockEnd > endSlot) {
      updatedBlocks.push({
        start: slotToTime(endSlot),
        end: block.end,
        value: block.value,
      });
    }
  }

  newSchedule[day] = updatedBlocks.sort(
    (a, b) => timeToSlot(a.start) - timeToSlot(b.start)
  );

  return newSchedule;
}

/**
 * Merge adjacent blocks with the same value
 */
function mergeAdjacentBlocks(blocks: TimeBlock[]): TimeBlock[] {
  if (blocks.length === 0) return [];

  const merged: TimeBlock[] = [{ ...blocks[0] }];

  for (let i = 1; i < blocks.length; i++) {
    const last = merged[merged.length - 1];
    const current = blocks[i];

    const lastEnd = last.end === '00:00' ? 48 : timeToSlot(last.end);
    const currentStart = timeToSlot(current.start);

    if (lastEnd === currentStart && last.value === current.value) {
      // Merge the blocks
      merged[merged.length - 1] = {
        start: last.start,
        end: current.end,
        value: last.value,
      };
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

/**
 * Get the value at a specific slot, or null if no block
 */
export function getValueAtSlot(
  schedule: WeeklySchedule,
  day: DayName,
  slot: number
): number | boolean | null {
  for (const block of schedule[day]) {
    const blockStart = timeToSlot(block.start);
    const blockEnd = block.end === '00:00' ? 48 : timeToSlot(block.end);

    if (slot >= blockStart && slot < blockEnd) {
      return block.value;
    }
  }
  return null;
}

/**
 * Check if a slot is within a timeblock
 */
export function isSlotInBlock(
  schedule: WeeklySchedule,
  day: DayName,
  slot: number
): boolean {
  return getValueAtSlot(schedule, day, slot) !== null;
}

/**
 * Copy a day's schedule to other days
 */
export function copyDayToOthers(
  schedule: WeeklySchedule,
  sourceDay: DayName,
  targetDays: DayName[]
): WeeklySchedule {
  const newSchedule = cloneSchedule(schedule);
  const sourceBlocks = newSchedule[sourceDay].map((block) => ({ ...block }));

  for (const targetDay of targetDays) {
    if (targetDay !== sourceDay) {
      newSchedule[targetDay] = sourceBlocks.map((block) => ({ ...block }));
    }
  }

  return newSchedule;
}

/**
 * Calculate total scheduled hours for a day
 */
export function getDayTotalHours(
  schedule: WeeklySchedule,
  day: DayName
): number {
  let totalMinutes = 0;

  for (const block of schedule[day]) {
    const start = timeToSlot(block.start) * 30;
    const end = block.end === '00:00' ? 24 * 60 : timeToSlot(block.end) * 30;
    totalMinutes += end - start;
  }

  return totalMinutes / 60;
}

/**
 * Get selection range as sorted slots
 */
export function normalizeSelection(
  startSlot: number,
  endSlot: number
): [number, number] {
  const min = Math.min(startSlot, endSlot);
  const max = Math.max(startSlot, endSlot) + 1; // +1 because selection is inclusive
  return [min, Math.min(max, 48)];
}
