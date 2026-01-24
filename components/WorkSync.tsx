"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Moon, Sun, Briefcase } from "lucide-react";
import { CITIES, WORK_START_HOUR, WORK_END_HOUR } from "@/lib/constants";
import { getTimeStatus, formatTime, getOffsetString } from "@/lib/time-utils";
import { addMinutes, startOfDay, format } from "date-fns";
import CitySelector from "./CitySelector";
import LanguageSelector from "./LanguageSelector";
import SettingsDialog from "./SettingsDialog";
import { cn } from "@/lib/utils";
import { translations, Language } from "@/lib/i18n";

// Default cities
const DEFAULT_CITIES = [
  CITIES.find(c => c.name === "Seoul")!,
  CITIES.find(c => c.name === "London")!,
  CITIES.find(c => c.name === "New York")!,
];

export default function WorkSync() {
  const [selectedCities, setSelectedCities] = useState(DEFAULT_CITIES);
  const [minutes, setMinutes] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [lang, setLang] = useState<Language>('ko');
  const [workStart, setWorkStart] = useState(WORK_START_HOUR);
  const [workEnd, setWorkEnd] = useState(WORK_END_HOUR);
  
  const t = translations[lang];

  // Initialize with current time
  useEffect(() => {
    setIsClient(true);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    setMinutes(currentMinutes);
  }, []);

  const addCity = (city: typeof CITIES[0]) => {
    if (!selectedCities.find((c) => c.name === city.name)) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const removeCity = (cityName: string) => {
    setSelectedCities(selectedCities.filter((c) => c.name !== cityName));
  };

  // Base date (today at 00:00)
  const baseDate = useMemo(() => {
    if (!isClient) return new Date();
    return startOfDay(new Date());
  }, [isClient]);

  const currentSelectedTime = useMemo(() => {
    return addMinutes(baseDate, minutes);
  }, [baseDate, minutes]);

  // Golden Hour Calculation
  const isGoldenHour = useMemo(() => {
    if (selectedCities.length === 0) return false;
    return selectedCities.every((city) => {
      const status = getTimeStatus(currentSelectedTime, city.timezone, workStart, workEnd);
      return status === 'work';
    });
  }, [currentSelectedTime, selectedCities, workStart, workEnd]);

  // Calculate Golden Intervals for the visual track
  const goldenIntervals = useMemo(() => {
    if (!isClient) return [];
    const intervals: { start: number; end: number }[] = [];
    let currentStart: number | null = null;

    for (let i = 0; i < 1440; i += 15) { // 15 min resolution
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

  if (!isClient) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header Section with Title and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-4 border-b border-border/40">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {t.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-light tracking-wide max-w-md">
            {t.subtitle}
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <LanguageSelector currentLang={lang} onSelect={setLang} />
          <div className="flex items-center gap-2">
             <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const now = new Date();
                  setMinutes(now.getHours() * 60 + now.getMinutes());
                }}
                className="text-xs h-8"
              >
                {t.reset}
              </Button>
             <SettingsDialog 
               workStart={workStart} 
               workEnd={workEnd} 
               onSave={(s, e) => { setWorkStart(s); setWorkEnd(e); }} 
               lang={lang}
             />
          </div>
        </div>
      </div>

      {/* 1. The Hero Timeline Scrubber */}
      <div className="relative pt-6 pb-6">
        {/* Main Time Display */}
        <div className="text-center mb-8">
           <motion.div 
             className="text-7xl font-mono font-bold tracking-tighter text-foreground inline-flex items-center gap-4"
             animate={{ 
               color: isGoldenHour ? "#FACC15" : "var(--foreground)",
               textShadow: isGoldenHour ? "0 0 40px rgba(250,204,21,0.5)" : "none"
             }}
           >
             {format(currentSelectedTime, "HH:mm")}
             {isGoldenHour && (
               <motion.span 
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-lg bg-yellow-400 text-yellow-950 px-3 py-1 rounded-full font-sans font-bold tracking-wide"
               >
                 {t.goldenHour}
               </motion.span>
             )}
           </motion.div>
           <p className="text-muted-foreground mt-2">{t.dragSlider}</p>
        </div>

        {/* The Track */}
        <div className="relative h-24 flex items-center select-none group">
            {/* Background Track */}
            <div className="absolute w-full h-3 bg-secondary rounded-full overflow-hidden">
               {/* Golden Intervals Highlights */}
               {goldenIntervals.map((interval, idx) => (
                  <div 
                    key={idx}
                    className="absolute h-full bg-yellow-500/30"
                    style={{
                      left: `${(interval.start / 1440) * 100}%`,
                      width: `${((interval.end - interval.start) / 1440) * 100}%`
                    }}
                  />
               ))}
            </div>

            {/* Range Input (Invisible but accessible) */}
            <input
              type="range"
              min={0}
              max={1440}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-ew-resize z-20"
            />

            {/* Visible Thumb/Scrubber */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-transform duration-75 ease-out"
              style={{ left: `${(minutes / 1440) * 100}%` }}
            >
              <div className="w-1 h-16 bg-primary shadow-[0_0_20px_rgba(59,130,246,0.5)] -translate-x-1/2 relative">
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs font-mono text-primary">
                    {format(currentSelectedTime, "HH:mm")}
                 </div>
              </div>
            </div>

            {/* Hour Markers */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-[2px] pointer-events-none opacity-30">
                {[0, 6, 12, 18, 24].map(h => (
                   <div key={h} className="h-4 w-px bg-foreground" />
                ))}
            </div>
        </div>
      </div>

      {/* 2. The City Cards (Visual Feedback) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {selectedCities.map((city) => {
            const status = getTimeStatus(currentSelectedTime, city.timezone, workStart, workEnd);
            const localTimeStr = formatTime(currentSelectedTime, city.timezone);
            const offset = getOffsetString(city.timezone);
            
            // Visual styles based on status
            const isWork = status === 'work';
            const isNight = status === 'night';
            
            // Translated status
            const statusText = t[status] || status;
            const cityName = t.cities[city.name as keyof typeof t.cities] || city.name;
            
            return (
              <motion.div
                key={city.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={cn(
                  "relative overflow-hidden border-none transition-colors duration-500",
                  isWork ? "bg-green-950/20" : isNight ? "bg-slate-900/40" : "bg-blue-900/20"
                )}>
                  {/* Dynamic Background Gradient */}
                  <div className={cn(
                    "absolute inset-0 transition-opacity duration-700",
                    isWork ? "bg-gradient-to-br from-green-500/10 to-transparent opacity-100" : "opacity-0"
                  )} />
                  <div className={cn(
                    "absolute inset-0 transition-opacity duration-700",
                    isNight ? "bg-gradient-to-br from-indigo-950 to-slate-950 opacity-80" : "opacity-0"
                  )} />
                   <div className={cn(
                    "absolute inset-0 transition-opacity duration-700",
                    status === 'day' ? "bg-gradient-to-br from-blue-400/10 to-orange-100/5 opacity-100" : "opacity-0"
                  )} />

                  <CardContent className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{cityName}</h3>
                        <p className="text-xs text-muted-foreground">{city.country} • {offset}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 -mr-2 -mt-2 text-muted-foreground/50 hover:text-foreground hover:bg-white/10 transition-all" 
                        onClick={() => removeCity(city.name)}
                        title="Remove city"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="text-4xl font-bold tracking-tight font-mono tabular-nums">
                        {localTimeStr}
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300",
                        isWork ? "bg-green-500/20 text-green-400" : isNight ? "bg-slate-700/50 text-slate-400" : "bg-blue-500/20 text-blue-300"
                      )}>
                        {isWork ? <Briefcase className="w-3 h-3" /> : isNight ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                        <span className="capitalize">{statusText}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Progress bar for the day */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/20">
                    <motion.div 
                      className={cn("h-full", isWork ? "bg-green-500" : "bg-blue-500")}
                      style={{ 
                         // Calculate percentage of day passed for this city
                         width: `${((parseInt(localTimeStr.split(':')[0]) * 60 + parseInt(localTimeStr.split(':')[1])) / 1440) * 100}%`
                      }} 
                    />
                  </div>
                </Card>
              </motion.div>
            );
          })}
          
          <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CitySelector onSelect={addCity} selectedCities={selectedCities} lang={lang} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
