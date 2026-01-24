import { City } from "./types";
import { formatTime } from "./time-utils";
import { Language, translations, cityNames } from "./i18n";
import { format, addHours } from "date-fns";

interface CalendarParams {
  selectedTime: Date;
  cities: City[];
  durationHours?: number;
  lang: Language;
  isGoldenHour: boolean;
}

export function generateGoogleCalendarURL(params: CalendarParams): string {
  const { selectedTime, cities, durationHours = 1, lang, isGoldenHour } = params;
  const t = translations[lang];

  // Format dates for Google Calendar (YYYYMMDDTHHmmssZ)
  const startDate = format(selectedTime, "yyyyMMdd'T'HHmmss'Z'");
  const endTime = addHours(selectedTime, durationHours);
  const endDate = format(endTime, "yyyyMMdd'T'HHmmss'Z'");

  // Build meeting title
  const meetingType = isGoldenHour ? t.goldenHour : t.silverHour;
  const title = `WorkSync Meeting (${meetingType})`;

  // Build description with city times
  const cityTimes = cities.map(city => {
    const localTime = formatTime(selectedTime, city.timezone);
    const cityName = cityNames[city.name]?.[lang] || city.name;
    return `${cityName}: ${localTime}`;
  }).join('\n');

  const description = `${t.title} - ${meetingType}\n\n${cityTimes}`;

  // Build Google Calendar URL
  const baseURL = 'https://calendar.google.com/calendar/render';
  const params_obj = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDate}/${endDate}`,
    details: description,
    sf: 'true',
    output: 'xml'
  });

  return `${baseURL}?${params_obj.toString()}`;
}

export function openGoogleCalendar(params: CalendarParams): void {
  const url = generateGoogleCalendarURL(params);
  window.open(url, '_blank', 'noopener,noreferrer');
}
