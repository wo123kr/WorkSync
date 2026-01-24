"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Moon, Sun, Briefcase, Clock, Zap } from "lucide-react";
import { CITIES, WORK_START_HOUR, WORK_END_HOUR } from "@/lib/constants";
import { getTimeStatus, formatTime, getOffsetString, getTopTimeSlots } from "@/lib/time-utils";
import { addMinutes, startOfDay, format } from "date-fns";
import CitySelector from "./CitySelector";
import LanguageSelector from "./LanguageSelector";
import SettingsDialog from "./SettingsDialog";
import ThemeToggle from "./ThemeToggle";
import OptimalTimesPanel from "./OptimalTimesPanel";
import ShareMenu from "./ShareMenu";
import { cn } from "@/lib/utils";
import { translations, Language, cityNames } from "@/lib/i18n";
import { parseURLParams, generateShareableURL, resolveCitiesFromNames } from "@/lib/url-utils";
import { openGoogleCalendar } from "@/lib/calendar-utils";
import { City } from "@/lib/types";

const DEFAULT_CITIES = [
  CITIES.find(c => c.name === "Seoul")!,
  CITIES.find(c => c.name === "London")!,
  CITIES.find(c => c.name === "New York")!,
];

export default function WorkSync() {
  const searchParams = useSearchParams();

  const [selectedCities, setSelectedCities] = useState<City[]>(DEFAULT_CITIES);
  const [minutes, setMinutes] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [lang, setLang] = useState<Language>('ko');
  const [workStart, setWorkStart] = useState(WORK_START_HOUR);
  const [workEnd, setWorkEnd] = useState(WORK_END_HOUR);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    setIsClient(true);

    // Priority: URL params > localStorage > defaults
    const urlState = parseURLParams(searchParams);
    let hasURLParams = false;

    // Handle cities from URL
    if (urlState.cities && urlState.cities.length > 0) {
      const resolvedCities = resolveCitiesFromNames(urlState.cities);
      if (resolvedCities.length > 0) {
        setSelectedCities(resolvedCities);
        hasURLParams = true;
      }
    }

    // Handle time from URL
    if (urlState.minutes !== undefined) {
      setMinutes(urlState.minutes);
      hasURLParams = true;
    } else {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      setMinutes(currentMinutes);
    }

    // Handle work hours from URL
    if (urlState.workStart !== undefined) {
      setWorkStart(urlState.workStart);
      hasURLParams = true;
    }
    if (urlState.workEnd !== undefined) {
      setWorkEnd(urlState.workEnd);
      hasURLParams = true;
    }

    // Handle language from URL
    if (urlState.lang) {
      setLang(urlState.lang as Language);
      hasURLParams = true;
    }

    // Only load from localStorage if no URL params
    if (!hasURLParams) {
      const savedCities = localStorage.getItem('worksync-cities');
      if (savedCities) {
        try {
          const parsed = JSON.parse(savedCities);
          const mapped = parsed.map((p: any) => CITIES.find(c => c.name === p.name)).filter(Boolean);
          if (mapped.length > 0) setSelectedCities(mapped);
        } catch (e) { console.error('Failed to parse saved cities', e); }
      }

      const savedLang = localStorage.getItem('worksync-lang');
      if (savedLang && ['ko', 'en', 'zh', 'ja'].includes(savedLang)) {
        setLang(savedLang as Language);
      }

      const savedSettings = localStorage.getItem('worksync-settings');
      if (savedSettings) {
        try {
          const { start, end } = JSON.parse(savedSettings);
          setWorkStart(start);
          setWorkEnd(end);
        } catch (e) { console.error('Failed to parse saved settings', e); }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('worksync-cities', JSON.stringify(selectedCities));
  }, [selectedCities, isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('worksync-lang', lang);
  }, [lang, isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('worksync-settings', JSON.stringify({ start: workStart, end: workEnd }));
  }, [workStart, workEnd, isClient]);

  const copyToClipboard = () => {
    const timeStr = format(currentSelectedTime, "HH:mm");
    const citiesStr = selectedCities.map(city => {
       const cityTime = formatTime(currentSelectedTime, city.timezone);
       return `${city.name}: ${cityTime}`;
    }).join('\n');

    const text = `[WorkSync] ${t.goldenHour}\nUTC: ${timeStr}\n\n${citiesStr}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyShareLink = () => {
    const url = generateShareableURL(selectedCities, minutes, workStart, workEnd, lang);
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const addToCalendar = () => {
    openGoogleCalendar({
      selectedTime: currentSelectedTime,
      cities: selectedCities,
      durationHours: 1,
      lang,
      isGoldenHour
    });
  };

  const addCity = (city: City) => {
    if (!selectedCities.find((c) => c.name === city.name)) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const removeCity = (cityName: string) => {
    setSelectedCities(selectedCities.filter((c) => c.name !== cityName));
  };

  const baseDate = useMemo(() => {
    if (!isClient) return new Date();
    return startOfDay(new Date());
  }, [isClient]);

  const currentSelectedTime = useMemo(() => {
    return addMinutes(baseDate, minutes);
  }, [baseDate, minutes]);

  const maxScore = useMemo(() => {
    if (!isClient || selectedCities.length === 0) return 0;
    let max = 0;
    for (let i = 0; i < 1440; i += 15) {
      const checkTime = addMinutes(baseDate, i);
      let score = 0;
      selectedCities.forEach((city) => {
        const status = getTimeStatus(checkTime, city.timezone, workStart, workEnd);
        if (status === 'work') score += 2;
        else if (status === 'day') score += 1;
        else score -= 2;
      });
      if (score > max) max = score;
    }
    return max;
  }, [baseDate, selectedCities, isClient, workStart, workEnd]);

  const currentScore = useMemo(() => {
    if (selectedCities.length === 0) return 0;
    let score = 0;
    selectedCities.forEach((city) => {
      const status = getTimeStatus(currentSelectedTime, city.timezone, workStart, workEnd);
      if (status === 'work') score += 2;
      else if (status === 'day') score += 1;
      else score -= 2;
    });
    return score;
  }, [currentSelectedTime, selectedCities, workStart, workEnd]);

  const isGoldenHour = useMemo(() => {
    if (selectedCities.length === 0) return false;
    return selectedCities.every((city) => {
      const status = getTimeStatus(currentSelectedTime, city.timezone, workStart, workEnd);
      return status === 'work';
    });
  }, [currentSelectedTime, selectedCities, workStart, workEnd]);

  const isSilverHour = !isGoldenHour && currentScore === maxScore && maxScore > 0;

  const goldenIntervals = useMemo(() => {
    if (!isClient) return [];
    const intervals: { start: number; end: number }[] = [];
    let currentStart: number | null = null;

    for (let i = 0; i < 1440; i += 15) {
      const checkTime = addMinutes(baseDate, i);
      const allWorking = selectedCities.every((city) => {
        const status = getTimeStatus(checkTime, city.timezone, workStart, workEnd);
        return status === 'work';
      });

      if (allWorking) {
        if (currentStart === null) currentStart = i;
      } else {
        if (currentStart !== null) {
          intervals.push({ start: currentStart, end: i });
          currentStart = null;
        }
      }
    }
    if (currentStart !== null) intervals.push({ start: currentStart, end: 1440 });
    return intervals;
  }, [baseDate, selectedCities, isClient, workStart, workEnd]);

  const silverIntervals = useMemo(() => {
    if (!isClient || selectedCities.length === 0) return [];
    const intervals: { start: number; end: number }[] = [];
    let currentStart: number | null = null;

    for (let i = 0; i < 1440; i += 15) {
      const checkTime = addMinutes(baseDate, i);
      let score = 0;
      selectedCities.forEach((city) => {
        const status = getTimeStatus(checkTime, city.timezone, workStart, workEnd);
        if (status === 'work') score += 2;
        else if (status === 'day') score += 1;
        else score -= 2;
      });

      const isGolden = selectedCities.every((city) => {
         const status = getTimeStatus(checkTime, city.timezone, workStart, workEnd);
         return status === 'work';
      });

      if (score === maxScore && !isGolden && maxScore > 0) {
        if (currentStart === null) currentStart = i;
      } else {
        if (currentStart !== null) {
          intervals.push({ start: currentStart, end: i });
          currentStart = null;
        }
      }
    }
    if (currentStart !== null) intervals.push({ start: currentStart, end: 1440 });
    return intervals;
  }, [baseDate, selectedCities, isClient, workStart, workEnd, maxScore]);

  const topTimeSlots = useMemo(() => {
    if (!isClient || selectedCities.length === 0) return [];
    return getTopTimeSlots(selectedCities, baseDate, workStart, workEnd, 3);
  }, [baseDate, selectedCities, isClient, workStart, workEnd]);

  // Keyboard shortcuts for power users
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setMinutes(m => Math.max(0, m - (e.shiftKey ? 60 : 15)));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setMinutes(m => Math.min(1440, m + (e.shiftKey ? 60 : 15)));
          break;
        case 'g':
        case 'G':
          // Jump to golden/silver hour
          if (goldenIntervals.length > 0) {
            setMinutes(goldenIntervals[0].start);
          } else if (silverIntervals.length > 0) {
            setMinutes(silverIntervals[0].start);
          }
          break;
        case 'n':
        case 'N':
          // Reset to now
          const now = new Date();
          setMinutes(now.getHours() * 60 + now.getMinutes());
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClient, goldenIntervals, silverIntervals]);

  const formatIntervalTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const jumpToGoldenHour = () => {
    if (goldenIntervals.length > 0) {
      setMinutes(goldenIntervals[0].start);
    } else if (silverIntervals.length > 0) {
      setMinutes(silverIntervals[0].start);
    }
  };

  if (!isClient) return null;

  const hasGoldenTime = goldenIntervals.length > 0;
  const hasSilverTime = silverIntervals.length > 0 && !hasGoldenTime;

  // Status counts for visual indicator
  const statusCounts = useMemo(() => {
    const counts = { work: 0, day: 0, night: 0 };
    selectedCities.forEach(city => {
      const status = getTimeStatus(currentSelectedTime, city.timezone, workStart, workEnd);
      counts[status]++;
    });
    return counts;
  }, [currentSelectedTime, selectedCities, workStart, workEnd]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-1">
          <LanguageSelector currentLang={lang} onSelect={setLang} />
          <ThemeToggle />
          <SettingsDialog
            workStart={workStart}
            workEnd={workEnd}
            onSave={(s, e) => { setWorkStart(s); setWorkEnd(e); }}
            lang={lang}
          />
        </div>
      </header>

      {/* Time Control Panel */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Time + Actions Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-4xl font-mono font-semibold tabular-nums">
                  {format(currentSelectedTime, "HH:mm")}
                </span>
                {/* Status Summary */}
                {selectedCities.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    {statusCounts.work > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-[hsl(var(--work))]">
                        <Briefcase className="w-3 h-3" />
                        {statusCounts.work}
                      </span>
                    )}
                    {statusCounts.day > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-[hsl(var(--day))]">
                        <Sun className="w-3 h-3" />
                        {statusCounts.day}
                      </span>
                    )}
                    {statusCounts.night > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Moon className="w-3 h-3" />
                        {statusCounts.night}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {(isGoldenHour || isSilverHour) && (
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded self-start mt-1",
                  isGoldenHour
                    ? "bg-[hsl(var(--golden))] text-white"
                    : "bg-muted text-muted-foreground"
                )}>
                  {isGoldenHour ? t.goldenHour : t.silverHour}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {(hasGoldenTime || hasSilverTime) && (
                <Button variant="outline" size="sm" onClick={jumpToGoldenHour} className="h-8 text-xs gap-1.5">
                  <Zap className="w-3 h-3" />
                  <span className="hidden sm:inline">{hasGoldenTime ? t.goldenHour : t.silverHour}</span>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => {
                const now = new Date();
                setMinutes(now.getHours() * 60 + now.getMinutes());
              }} className="h-8 text-xs gap-1.5 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="hidden sm:inline">{t.reset}</span>
              </Button>
              <ShareMenu
                onCopyText={copyToClipboard}
                onCopyLink={copyShareLink}
                onAddToCalendar={addToCalendar}
                copied={copied}
                linkCopied={linkCopied}
                labels={{
                  share: t.share,
                  copy: t.copy,
                  copied: t.copied,
                  shareLink: t.shareLink,
                  linkCopied: t.linkCopied,
                  calendar: t.calendar,
                }}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative h-8">
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              {silverIntervals.map((interval, idx) => (
                <div
                  key={`silver-${idx}`}
                  className="absolute h-full bg-muted-foreground/30"
                  style={{
                    left: `${(interval.start / 1440) * 100}%`,
                    width: `${((interval.end - interval.start) / 1440) * 100}%`
                  }}
                />
              ))}
              {goldenIntervals.map((interval, idx) => (
                <div
                  key={`golden-${idx}`}
                  className="absolute h-full bg-[hsl(var(--golden))]"
                  style={{
                    left: `${(interval.start / 1440) * 100}%`,
                    width: `${((interval.end - interval.start) / 1440) * 100}%`
                  }}
                />
              ))}
            </div>

            <input
              type="range"
              min={0}
              max={1440}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-ew-resize z-10"
              aria-label="Time selector"
            />

            <div
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `calc(${(minutes / 1440) * 100}% - 1px)` }}
            >
              <div className="w-0.5 h-4 bg-foreground rounded-full" />
            </div>
          </div>

          {/* Hour Labels + Keyboard Hints */}
          <div className="flex justify-between items-end text-[10px] text-muted-foreground font-mono -mt-1">
            <span>00:00</span>
            <span>06:00</span>
            <span className="hidden md:flex flex-col items-center gap-0.5">
              <span>12:00</span>
              <span className="text-[8px] opacity-60">← → G N</span>
            </span>
            <span className="md:hidden">12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>

          {/* Best Times */}
          {(hasGoldenTime || hasSilverTime) && (
            <div className="flex items-center gap-2 text-xs pt-2 border-t">
              <span className="text-muted-foreground">
                {hasGoldenTime ? t.goldenHour : t.silverHour}:
              </span>
              {(hasGoldenTime ? goldenIntervals : silverIntervals).slice(0, 3).map((interval, idx) => (
                <button
                  key={idx}
                  onClick={() => setMinutes(interval.start)}
                  className="font-mono px-2 py-0.5 rounded bg-secondary hover:bg-accent transition-colors"
                >
                  {formatIntervalTime(interval.start)}–{formatIntervalTime(interval.end)}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optimal Times Panel */}
      <OptimalTimesPanel
        timeSlots={topTimeSlots}
        lang={lang}
        onSelectTime={setMinutes}
      />

      {/* City Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
        <AnimatePresence mode="popLayout">
          {selectedCities.map((city) => {
            const status = getTimeStatus(currentSelectedTime, city.timezone, workStart, workEnd);
            const localTimeStr = formatTime(currentSelectedTime, city.timezone);
            const offset = getOffsetString(city.timezone);

            const isWork = status === 'work';
            const isNight = status === 'night';

            const statusText = t[status] || status;
            const cityName = cityNames[city.name]?.[lang] || city.name;

            return (
              <motion.div
                key={city.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                <Card className="group h-full">
                  <CardContent className="p-4">
                    {/* Header: City name + delete */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{cityName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{offset}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-1"
                        onClick={() => removeCity(city.name)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Time */}
                    <div className="text-3xl font-mono font-semibold tabular-nums mb-2">
                      {localTimeStr}
                    </div>

                    {/* Status Badge - Below time */}
                    <div className={cn(
                      "inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md",
                      isWork && "bg-[hsl(var(--work)/0.15)] text-[hsl(var(--work))]",
                      status === 'day' && "bg-[hsl(var(--day)/0.15)] text-[hsl(var(--day))]",
                      isNight && "bg-secondary text-muted-foreground"
                    )}>
                      {isWork ? <Briefcase className="w-3 h-3" /> :
                       isNight ? <Moon className="w-3 h-3" /> :
                       <Sun className="w-3 h-3" />}
                      {statusText}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
            <CitySelector onSelect={addCity} selectedCities={selectedCities} lang={lang} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
