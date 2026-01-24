import { toZonedTime, format } from "date-fns-tz";
import { getHours } from "date-fns";
import { WORK_START_HOUR, WORK_END_HOUR } from "./constants";

export function getLocalTime(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone);
}

export function formatTime(date: Date, timezone: string, fmt: string = "HH:mm"): string {
  // format from date-fns-tz handles timezone
  return format(date, fmt, { timeZone: timezone });
}

export function isWorkTime(date: Date, timezone: string, workStart: number = WORK_START_HOUR, workEnd: number = WORK_END_HOUR): boolean {
  const localDate = toZonedTime(date, timezone);
  const hours = getHours(localDate);
  return hours >= workStart && hours < workEnd;
}

export function getTimeStatus(date: Date, timezone: string, workStart: number = WORK_START_HOUR, workEnd: number = WORK_END_HOUR): 'work' | 'day' | 'night' {
  const localDate = toZonedTime(date, timezone);
  const hours = getHours(localDate);
  
  if (hours >= workStart && hours < workEnd) {
    return 'work';
  }
  
  if (hours >= 6 && hours < 22) { // Assuming day is 6am to 10pm roughly for simplicity, excluding work hours
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
