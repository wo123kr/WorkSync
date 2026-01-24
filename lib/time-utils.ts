import { toZonedTime, format } from "date-fns-tz";
import { getHours, getMinutes, addMinutes, startOfDay } from "date-fns";
import { WORK_START_HOUR, WORK_END_HOUR } from "./constants";
import { City, TimeSlot, TimeStatus } from "./types";

// Get decimal hours (e.g., 9:30 = 9.5)
function getDecimalHours(date: Date): number {
  return getHours(date) + getMinutes(date) / 60;
}

export function getLocalTime(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone);
}

export function formatTime(date: Date, timezone: string, fmt: string = "HH:mm"): string {
  // format from date-fns-tz handles timezone
  const zonedDate = toZonedTime(date, timezone);
  return format(zonedDate, fmt, { timeZone: timezone });
}

export function isWorkTime(date: Date, timezone: string, workStart: number = WORK_START_HOUR, workEnd: number = WORK_END_HOUR): boolean {
  const localDate = toZonedTime(date, timezone);
  const decimalHours = getDecimalHours(localDate);
  return decimalHours >= workStart && decimalHours < workEnd;
}

export function getTimeStatus(date: Date, timezone: string, workStart: number = WORK_START_HOUR, workEnd: number = WORK_END_HOUR): 'work' | 'day' | 'night' {
  const localDate = toZonedTime(date, timezone);
  const decimalHours = getDecimalHours(localDate);

  if (decimalHours >= workStart && decimalHours < workEnd) {
    return 'work';
  }

  if (decimalHours >= 6 && decimalHours < 22) { // Assuming day is 6am to 10pm roughly for simplicity, excluding work hours
    return 'day';
  }

  return 'night';
}

export function getOffsetString(timezone: string): string {
    const now = new Date();
    const tzDate = toZonedTime(now, timezone);
    const offset = format(now, 'XXX', { timeZone: timezone });
    return `GMT${offset}`;
}

export function getTopTimeSlots(
  cities: City[],
  baseDate: Date,
  workStart: number,
  workEnd: number,
  maxSlots: number = 3
): TimeSlot[] {
  if (cities.length === 0) return [];

  const intervals: { start: number; end: number; type: 'golden' | 'silver'; score: number }[] = [];
  let currentStart: number | null = null;
  let currentType: 'golden' | 'silver' | null = null;

  // Calculate max score for silver hour detection
  let maxScore = 0;
  for (let i = 0; i < 1440; i += 15) {
    const checkTime = addMinutes(baseDate, i);
    let score = 0;
    cities.forEach((city) => {
      const status = getTimeStatus(checkTime, city.timezone, workStart, workEnd);
      if (status === 'work') score += 2;
      else if (status === 'day') score += 1;
      else score -= 2;
    });
    if (score > maxScore) maxScore = score;
  }

  // Find all golden and silver intervals
  for (let i = 0; i < 1440; i += 15) {
    const checkTime = addMinutes(baseDate, i);

    // Check if golden hour (all cities in work time)
    const isGolden = cities.every((city) => {
      const status = getTimeStatus(checkTime, city.timezone, workStart, workEnd);
      return status === 'work';
    });

    // Calculate current score
    let score = 0;
    cities.forEach((city) => {
      const status = getTimeStatus(checkTime, city.timezone, workStart, workEnd);
      if (status === 'work') score += 2;
      else if (status === 'day') score += 1;
      else score -= 2;
    });

    const isSilver = !isGolden && score === maxScore && maxScore > 0;
    const type: 'golden' | 'silver' | null = isGolden ? 'golden' : isSilver ? 'silver' : null;

    if (type !== null) {
      if (currentStart === null || currentType !== type) {
        // Save previous interval if exists
        if (currentStart !== null && currentType !== null) {
          intervals.push({ start: currentStart, end: i, type: currentType, score });
        }
        currentStart = i;
        currentType = type;
      }
    } else {
      if (currentStart !== null && currentType !== null) {
        intervals.push({ start: currentStart, end: i, type: currentType, score });
        currentStart = null;
        currentType = null;
      }
    }
  }

  // Handle interval that extends to end of day
  if (currentStart !== null && currentType !== null) {
    intervals.push({ start: currentStart, end: 1440, type: currentType, score: maxScore });
  }

  // Sort: golden first, then by duration
  intervals.sort((a, b) => {
    if (a.type === 'golden' && b.type !== 'golden') return -1;
    if (a.type !== 'golden' && b.type === 'golden') return 1;
    return (b.end - b.start) - (a.end - a.start); // Longer intervals first
  });

  // Take top N and build full TimeSlot objects
  return intervals.slice(0, maxSlots).map(interval => {
    const slotTime = addMinutes(baseDate, interval.start);
    const cityStatuses = cities.map(city => {
      const localTime = formatTime(slotTime, city.timezone);
      const status = getTimeStatus(slotTime, city.timezone, workStart, workEnd);
      return { city, localTime, status };
    });

    return {
      start: interval.start,
      end: interval.end,
      type: interval.type,
      cityStatuses
    };
  });
}
