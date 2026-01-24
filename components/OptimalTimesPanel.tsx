"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Moon, Sun, Star, ChevronDown } from "lucide-react";
import { TimeSlot } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Language, translations, cityNames } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

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
  const [expanded, setExpanded] = useState(false);
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

  const bestSlot = timeSlots[0];
  const otherSlots = timeSlots.slice(1);
  const hasMore = otherSlots.length > 0;

  const SlotButton = ({ slot, compact = false }: { slot: TimeSlot; compact?: boolean }) => (
    <button
      onClick={() => onSelectTime(slot.start)}
      className={cn(
        "w-full text-left rounded-lg border transition-all hover:scale-[1.01] active:scale-[0.99]",
        compact ? "p-2" : "p-3",
        slot.type === 'golden'
          ? "border-[hsl(var(--golden)/0.3)] bg-[hsl(var(--golden)/0.05)] hover:bg-[hsl(var(--golden)/0.1)]"
          : "border-border bg-secondary/30 hover:bg-secondary/50"
      )}
    >
      <div className={cn("flex items-center gap-2", !compact && "mb-2")}>
        <span className={cn(
          "text-[10px] font-semibold px-1.5 py-0.5 rounded",
          slot.type === 'golden'
            ? "bg-[hsl(var(--golden))] text-white"
            : "bg-muted text-muted-foreground"
        )}>
          {slot.type === 'golden' ? t.goldenHour : t.silverHour}
        </span>
        <span className="font-mono text-sm font-medium">
          {formatIntervalTime(slot.start)}–{formatIntervalTime(slot.end)}
        </span>
      </div>

      {!compact && (
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
      )}
    </button>
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[hsl(var(--golden))]" />
            <span className="text-sm font-medium">{t.optimalTimes}</span>
          </div>
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{expanded ? t.showLess || "Less" : `+${otherSlots.length}`}</span>
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                expanded && "rotate-180"
              )} />
            </button>
          )}
        </div>

        {/* Best Slot */}
        <SlotButton slot={bestSlot} />

        {/* Other Slots (Expandable) */}
        <AnimatePresence>
          {expanded && hasMore && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 mt-2">
                {otherSlots.map((slot, idx) => (
                  <SlotButton key={idx} slot={slot} compact />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
