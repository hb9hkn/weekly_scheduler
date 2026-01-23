/**
 * Time utility functions for Weekly Scheduler
 */

import { DayName, DAYS } from '../types';

/**
 * Convert slot index (0-47) to time string (HH:MM)
 */
export function slotToTime(slot: number): string {
  const hours = Math.floor(slot / 2);
  const minutes = (slot % 2) * 30;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Convert time string (HH:MM) to slot index (0-47)
 */
export function timeToSlot(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 2 + Math.floor(minutes / 30);
}

/**
 * Get the current day name
 */
export function getCurrentDay(): DayName {
  const dayIndex = new Date().getDay();
  // JavaScript: 0=Sunday, we want 0=Monday
  const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return DAYS[adjustedIndex];
}

/**
 * Get current time as HH:MM string
 */
export function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * Get current slot index (0-47)
 */
export function getCurrentSlot(): number {
  const now = new Date();
  return now.getHours() * 2 + Math.floor(now.getMinutes() / 30);
}

/**
 * Calculate position within current slot (0-1)
 */
export function getSlotProgress(): number {
  const now = new Date();
  const minutesInSlot = now.getMinutes() % 30;
  return minutesInSlot / 30;
}

/**
 * Format time for display (12h or 24h based on user preference)
 */
export function formatTimeDisplay(time: string, use24h: boolean = true): string {
  if (use24h) {
    return time;
  }
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Generate time labels for the grid (every 2 hours)
 */
export function generateTimeLabels(): string[] {
  const labels: string[] = [];
  for (let hour = 0; hour < 24; hour += 2) {
    labels.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return labels;
}

/**
 * Check if two time ranges overlap
 */
export function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = timeToSlot(start1);
  const e1 = end1 === '00:00' ? 48 : timeToSlot(end1);
  const s2 = timeToSlot(start2);
  const e2 = end2 === '00:00' ? 48 : timeToSlot(end2);
  return s1 < e2 && s2 < e1;
}
