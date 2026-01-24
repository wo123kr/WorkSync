"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Moon, Sun, Star } from "lucide-react";
import { TimeSlot } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Language, translations, cityNames } from "@/lib/i18n";

interface OptimalTimesPanelProps {
  timeSlots: TimeSlot[];
  lang: Language;
  onSelectTime: (minutes: number) => void;
}

export default function OptimalTimesPanel({
  timeSlots,
  lang,
  onSelectTime,
}: OptimalTimesPanelProps) {
  const t = translations[lang];

  if (timeSlots.length === 0) return null;

  const formatIntervalTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const StatusIcon = ({ status }: { status: 'work' | 'day' | 'night' }) => {
    if (status === 'work') return <Briefcase className="w-3 h-3" />;
    if (status === 'night') return <Moon className="w-3 h-3" />;
    return <Sun className="w-3 h-3" />;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-[hsl(var(--golden))]" />
          <span className="text-sm font-medium">{t.optimalTimes || "Recommended Times"}</span>
        </div>

        <div className="space-y-2">
          {timeSlots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => onSelectTime(slot.start)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-colors hover:bg-accent/50",
                slot.type === 'golden'
                  ? "border-[hsl(var(--golden)/0.3)] bg-[hsl(var(--golden)/0.05)]"
                  : "border-border bg-secondary/30"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                  slot.type === 'golden'
                    ? "bg-[hsl(var(--golden))] text-white"
                    : "bg-muted text-muted-foreground"
                )}>
                  {slot.type === 'golden' ? t.goldenHour : t.silverHour}
                </span>
                <span className="font-mono text-sm">
                  {formatIntervalTime(slot.start)}–{formatIntervalTime(slot.end)}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {slot.cityStatuses.map((cs, csIdx) => {
                  const cityName = cityNames[cs.city.name]?.[lang] || cs.city.name;
                  return (
                    <div
                      key={csIdx}
                      className={cn(
                        "flex items-center gap-1 text-xs",
                        cs.status === 'work' && "text-[hsl(var(--work))]",
                        cs.status === 'day' && "text-[hsl(var(--day))]",
                        cs.status === 'night' && "text-muted-foreground"
                      )}
                    >
                      <StatusIcon status={cs.status} />
                      <span>{cityName}</span>
                      <span className="font-mono">{cs.localTime}</span>
                    </div>
                  );
                })}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
