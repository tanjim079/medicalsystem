/**
 * Standard consultation time slots for RUET Medical Centre
 * Working Hours: 08:00 AM - 09:00 PM (Sat - Thu, Closed Friday)
 * Lunch Break: 01:30 PM - 03:00 PM
 */

export interface TimeSlotSection {
  title: string;
  slots: string[];
}

export const CONSULTATION_TIME_SLOTS: TimeSlotSection[] = [
  {
    title: 'Morning Shift (08:00 AM - 01:00 PM)',
    slots: [
      '08:00 AM',
      '08:15 AM',
      '08:30 AM',
      '08:45 AM',
      '09:00 AM',
      '09:15 AM',
      '09:30 AM',
      '09:45 AM',
      '10:00 AM',
      '10:15 AM',
      '10:30 AM',
      '10:45 AM',
      '11:00 AM',
      '11:15 AM',
      '11:30 AM',
      '11:45 AM',
      '12:00 PM',
      '12:15 PM',
      '12:30 PM',
      '12:45 PM',
      '01:00 PM',
    ],
  },
  {
    title: 'Afternoon & Evening Shift (03:00 PM - 08:30 PM)',
    slots: [
      '03:00 PM',
      '03:15 PM',
      '03:30 PM',
      '03:45 PM',
      '04:00 PM',
      '04:15 PM',
      '04:30 PM',
      '04:45 PM',
      '05:00 PM',
      '05:15 PM',
      '05:30 PM',
      '05:45 PM',
      '06:00 PM',
      '06:15 PM',
      '06:30 PM',
      '06:45 PM',
      '07:00 PM',
      '07:15 PM',
      '07:30 PM',
      '07:45 PM',
      '08:00 PM',
      '08:15 PM',
      '08:30 PM',
    ],
  },
];

/**
 * Normalizes any time string (e.g. "09:00", "9:00", "09:00 AM", "14:30", "02:30 PM")
 * to a standard 24-hour "HH:mm" format for reliable comparison.
 */
export function normalizeTimeTo24Hour(time: string): string {
  if (!time) return '';
  const trimmed = time.trim();

  // Check for 12-hour format with AM/PM (e.g. "09:30 AM", "2:15 pm")
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2];
    const meridian = match12[3].toUpperCase();

    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  // Check for 24-hour format (e.g. "09:00", "14:30", "9:30")
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = match24[2];
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  return trimmed;
}

/**
 * Formats any time string to 12-hour "hh:mm AM/PM" format for display.
 */
export function formatTimeTo12Hour(time: string): string {
  if (!time) return '';
  const time24 = normalizeTimeTo24Hour(time);
  const match = time24.match(/^(\d{2}):(\d{2})$/);
  if (!match) return time;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const meridian = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${minutes} ${meridian}`;
}

/**
 * Checks whether two time strings refer to the same time regardless of format.
 */
export function areTimesEqual(timeA: string, timeB: string): boolean {
  if (!timeA || !timeB) return false;
  return normalizeTimeTo24Hour(timeA) === normalizeTimeTo24Hour(timeB);
}
