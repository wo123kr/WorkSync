import { CITIES } from "./constants";

export type City = typeof CITIES[number];

export type TimeStatus = 'work' | 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeSlot {
  start: number; // minutes from 00:00
  end: number;
  type: 'golden' | 'silver';
  cityStatuses: CityStatus[];
}

export interface CityStatus {
  city: City;
  localTime: string;
  status: TimeStatus;
}

export interface URLState {
  cities: string[];
  minutes: number;
  workStart: number;
  workEnd: number;
  lang: string;
}
