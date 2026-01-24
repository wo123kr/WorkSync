"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { translations, Language } from "@/lib/i18n";
import { WORK_START_HOUR, WORK_END_HOUR } from "@/lib/constants";

interface SettingsDialogProps {
  workStart: number;
  workEnd: number;
  onSave: (start: number, end: number) => void;
  lang: Language;
}

// Convert decimal hours to { hour, minute }
const decimalToHourMin = (decimal: number): { hour: number; minute: number } => {
  const hour = Math.floor(decimal);
  const minute = Math.round((decimal - hour) * 60);
  // Normalize minute to 0 or 30
  return { hour, minute: minute >= 30 ? 30 : 0 };
};

// Convert { hour, minute } to decimal hours
const hourMinToDecimal = (hour: number, minute: number): number => {
  return hour + (minute / 60);
};

// Generate hour options (0-23)
const HOURS = Array.from({ length: 24 }, (_, i) => i);
// Generate minute options (0, 30)
const MINUTES = [0, 30];

export default function SettingsDialog({ workStart, workEnd, onSave, lang }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [startHour, setStartHour] = useState(decimalToHourMin(workStart).hour);
  const [startMin, setStartMin] = useState(decimalToHourMin(workStart).minute);
  const [endHour, setEndHour] = useState(decimalToHourMin(workEnd).hour);
  const [endMin, setEndMin] = useState(decimalToHourMin(workEnd).minute);
  const t = translations[lang];

  useEffect(() => {
    if (open) {
      const start = decimalToHourMin(workStart);
      const end = decimalToHourMin(workEnd);
      setStartHour(start.hour);
      setStartMin(start.minute);
      setEndHour(end.hour);
      setEndMin(end.minute);
    }
  }, [open, workStart, workEnd]);

  const handleSave = () => {
    const startDecimal = hourMinToDecimal(startHour, startMin);
    const endDecimal = hourMinToDecimal(endHour, endMin);
    onSave(startDecimal, endDecimal);
    setOpen(false);
  };

  const handleReset = () => {
    const start = decimalToHourMin(WORK_START_HOUR);
    const end = decimalToHourMin(WORK_END_HOUR);
    setStartHour(start.hour);
    setStartMin(start.minute);
    setEndHour(end.hour);
    setEndMin(end.minute);
  };

  const selectClass = "flex h-9 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono cursor-pointer";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>{t.globalSettings}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">{t.workHours}</Label>
            <div className="grid grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="space-y-1.5">
                <Label className="text-xs">{t.startTime}</Label>
                <div className="flex items-center gap-1">
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(Number(e.target.value))}
                    className={`${selectClass} w-16`}
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="text-muted-foreground">:</span>
                  <select
                    value={startMin}
                    onChange={(e) => setStartMin(Number(e.target.value))}
                    className={`${selectClass} w-16`}
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>
                        {m.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* End Time */}
              <div className="space-y-1.5">
                <Label className="text-xs">{t.endTime}</Label>
                <div className="flex items-center gap-1">
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(Number(e.target.value))}
                    className={`${selectClass} w-16`}
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="text-muted-foreground">:</span>
                  <select
                    value={endMin}
                    onChange={(e) => setEndMin(Number(e.target.value))}
                    className={`${selectClass} w-16`}
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>
                        {m.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
              Reset
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                {t.cancel}
              </Button>
              <Button size="sm" onClick={handleSave}>
                {t.save}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
