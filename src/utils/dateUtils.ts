/**
 * Date utility helpers for appointment scheduling.
 * Provides functions for local date manipulation, calculating the open 7-day
 * booking window, and validating appointment dates.
 */

export const BOOKING_WINDOW_DAYS = 7;

/**
 * Format a Date instance as a local 'YYYY-MM-DD' string without UTC timezone shift.
 */
export function formatLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a 'YYYY-MM-DD' string into a local Date instance.
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export interface BookingDayItem {
  dateStr: string;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  dayName: string;
  dayShort: string;
  displayDate: string;
  dayNumber: number;
  monthShort: string;
  isToday: boolean;
  isTomorrow: boolean;
  isFriday: boolean;
  isOpen: boolean;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORTS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Generates the list of consecutive days in the booking window starting from today.
 * By default generates 7 days (Day 1 = Today through Day 7 = Today + 6).
 */
export function getBookingWindow(days = BOOKING_WINDOW_DAYS): BookingDayItem[] {
  const list: BookingDayItem[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const dateStr = formatLocalDate(d);
    const dayOfWeek = d.getDay();
    const isFriday = dayOfWeek === 5;

    list.push({
      dateStr,
      dayOfWeek,
      dayName: DAY_NAMES[dayOfWeek],
      dayShort: DAY_SHORTS[dayOfWeek],
      displayDate: `${d.getDate()} ${MONTH_SHORTS[d.getMonth()]}`,
      dayNumber: d.getDate(),
      monthShort: MONTH_SHORTS[d.getMonth()],
      isToday: i === 0,
      isTomorrow: i === 1,
      isFriday,
      isOpen: !isFriday,
    });
  }

  return list;
}

/**
 * Returns minDate, maxDate strings ('YYYY-MM-DD') and human-friendly range label.
 */
export function getBookingWindowBounds(days = BOOKING_WINDOW_DAYS): {
  minDate: string;
  maxDate: string;
  minDateLabel: string;
  maxDateLabel: string;
  windowLabel: string;
} {
  const windowDays = getBookingWindow(days);
  const first = windowDays[0];
  const last = windowDays[windowDays.length - 1];

  const minDateLabel = `${first.dayShort}, ${first.displayDate}`;
  const maxDateLabel = `${last.dayShort}, ${last.displayDate}`;

  return {
    minDate: first.dateStr,
    maxDate: last.dateStr,
    minDateLabel,
    maxDateLabel,
    windowLabel: `${minDateLabel} – ${maxDateLabel}`,
  };
}

/**
 * Validates whether a given date string is permissible for booking:
 * - Must be within the 7-day window (today to today + 6 days).
 * - Must not be a Friday (RUET Medical Center closed).
 */
export function validateBookingDate(dateStr: string, days = BOOKING_WINDOW_DAYS): {
  isValid: boolean;
  error?: string;
} {
  if (!dateStr) {
    return { isValid: false, error: 'Please select an appointment date.' };
  }

  const { minDate, maxDate, minDateLabel, maxDateLabel } = getBookingWindowBounds(days);

  if (dateStr < minDate) {
    return {
      isValid: false,
      error: `Past dates are blocked (earliest available date is ${minDateLabel}). You cannot book an appointment in the past.`,
    };
  }

  if (dateStr > maxDate) {
    return {
      isValid: false,
      error: `Booking is only open for the next ${days} days (up to ${maxDateLabel}). Future dates beyond this window are blocked.`,
    };
  }

  const parsed = parseLocalDate(dateStr);
  if (parsed.getDay() === 5) {
    return {
      isValid: false,
      error: 'The RUET Health Complex is closed on Fridays. Please select an open working day (Saturday – Thursday).',
    };
  }

  return { isValid: true };
}
