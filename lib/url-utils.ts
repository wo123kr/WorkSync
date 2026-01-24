import { CITIES, WORK_START_HOUR, WORK_END_HOUR } from "./constants";
import { URLState, City } from "./types";
import { Language } from "./i18n";

const VALID_LANGUAGES = ['ko', 'en', 'zh', 'ja'];

export function parseURLParams(searchParams: URLSearchParams): Partial<URLState> {
  const result: Partial<URLState> = {};

  // Parse cities
  const citiesParam = searchParams.get('cities');
  if (citiesParam) {
    const cityNames = citiesParam.split(',').map(c => decodeURIComponent(c.trim()));
    const validCities = cityNames.filter(name =>
      CITIES.some(c => c.name.toLowerCase() === name.toLowerCase())
    );
    if (validCities.length > 0) {
      result.cities = validCities;
    }
  }

  // Parse time (minutes from 00:00)
  const timeParam = searchParams.get('time');
  if (timeParam) {
    const minutes = parseInt(timeParam, 10);
    if (!isNaN(minutes) && minutes >= 0 && minutes <= 1440) {
      result.minutes = minutes;
    }
  }

  // Parse work start
  const startParam = searchParams.get('start');
  if (startParam) {
    const start = parseInt(startParam, 10);
    if (!isNaN(start) && start >= 0 && start <= 23) {
      result.workStart = start;
    }
  }

  // Parse work end
  const endParam = searchParams.get('end');
  if (endParam) {
    const end = parseInt(endParam, 10);
    if (!isNaN(end) && end >= 1 && end <= 24) {
      result.workEnd = end;
    }
  }

  // Parse language
  const langParam = searchParams.get('lang');
  if (langParam && VALID_LANGUAGES.includes(langParam)) {
    result.lang = langParam;
  }

  return result;
}

export function generateShareableURL(
  cities: City[],
  minutes: number,
  workStart: number,
  workEnd: number,
  lang: Language
): string {
  const params = new URLSearchParams();

  // Add cities
  if (cities.length > 0) {
    params.set('cities', cities.map(c => c.name).join(','));
  }

  // Add time
  params.set('time', minutes.toString());

  // Add work hours only if not default
  if (workStart !== WORK_START_HOUR) {
    params.set('start', workStart.toString());
  }
  if (workEnd !== WORK_END_HOUR) {
    params.set('end', workEnd.toString());
  }

  // Add language
  params.set('lang', lang);

  const baseURL = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return `${baseURL}?${params.toString()}`;
}

export function resolveCitiesFromNames(names: string[]): City[] {
  return names
    .map(name => CITIES.find(c => c.name.toLowerCase() === name.toLowerCase()))
    .filter((city): city is City => city !== undefined);
}
