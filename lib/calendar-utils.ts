import { City } from "./types";
import { formatTime, getTimeStatus } from "./time-utils";
import { Language, translations, cityNames } from "./i18n";
import { format, addHours } from "date-fns";

interface CalendarParams {
  selectedTime: Date;
  cities: City[];
  durationHours?: number;
  lang: Language;
  isGoldenHour: boolean;
  workStart?: number;
  workEnd?: number;
}

const calendarStrings: Record<Language, {
  title: string;
  participants: string;
  localTimes: string;
  createdBy: string;
}> = {
  ko: {
    title: "글로벌 팀 미팅",
    participants: "참여 지역",
    localTimes: "각 지역 현지 시간",
    createdBy: "WorkSync로 생성됨",
  },
  en: {
    title: "Global Team Meeting",
    participants: "Participants",
    localTimes: "Local times for each region",
    createdBy: "Created with WorkSync",
  },
  zh: {
    title: "全球团队会议",
    participants: "参与地区",
    localTimes: "各地区当地时间",
    createdBy: "由WorkSync创建",
  },
  ja: {
    title: "グローバルチームミーティング",
    participants: "参加地域",
    localTimes: "各地域の現地時間",
    createdBy: "WorkSyncで作成",
  },
};

export function generateGoogleCalendarURL(params: CalendarParams): string {
  const { selectedTime, cities, durationHours = 1, lang, isGoldenHour, workStart = 9, workEnd = 18 } = params;
  const t = translations[lang];
  const cs = calendarStrings[lang];

  // Format dates for Google Calendar (YYYYMMDDTHHmmssZ)
  const startDate = format(selectedTime, "yyyyMMdd'T'HHmmss'Z'");
  const endTime = addHours(selectedTime, durationHours);
  const endDate = format(endTime, "yyyyMMdd'T'HHmmss'Z'");

  // Build meeting title
  const meetingType = isGoldenHour ? t.goldenHour : t.silverHour;
  const title = `🌍 ${cs.title}`;

  // Status emoji helper
  const statusEmoji = (status: string) => {
    if (status === 'work') return '🏢';
    if (status === 'morning') return '🌅';
    if (status === 'afternoon') return '☀️';
    return '🌙'; // night
  };

  // Build description with city times and status
  const cityTimes = cities.map(city => {
    const localTime = formatTime(selectedTime, city.timezone);
    const cityName = cityNames[city.name]?.[lang] || city.name;
    const status = getTimeStatus(selectedTime, city.timezone, workStart, workEnd);
    const statusText = t[status] || status;
    return `${statusEmoji(status)} ${cityName}: ${localTime} (${statusText})`;
  }).join('\n');

  const description = `📅 ${cs.localTimes}:\n\n${cityTimes}\n\n---\n${cs.createdBy}`;

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
