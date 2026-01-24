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

// Convert decimal hours to HH:mm format
const decimalToTime = (decimal: number): string => {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Convert HH:mm to decimal hours
const timeToDecimal = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + (minutes / 60);
};

export default function SettingsDialog({ workStart, workEnd, onSave, lang }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(decimalToTime(workStart));
  const [end, setEnd] = useState(decimalToTime(workEnd));
  const t = translations[lang];

  useEffect(() => {
    if (open) {
      setStart(decimalToTime(workStart));
      setEnd(decimalToTime(workEnd));
    }
  }, [open, workStart, workEnd]);

  const handleSave = () => {
    const startDecimal = timeToDecimal(start);
    const endDecimal = timeToDecimal(end);
    onSave(startDecimal, endDecimal);
    setOpen(false);
  };

  const handleReset = () => {
    setStart(decimalToTime(WORK_START_HOUR));
    setEnd(decimalToTime(WORK_END_HOUR));
  };

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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="start-time" className="text-xs">{t.startTime}</Label>
                <input
                  id="start-time"
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end-time" className="text-xs">{t.endTime}</Label>
                <input
                  id="end-time"
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                />
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
