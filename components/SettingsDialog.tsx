"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

export default function SettingsDialog({ workStart, workEnd, onSave, lang }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(String(workStart));
  const [end, setEnd] = useState(String(workEnd));
  const t = translations[lang];

  useEffect(() => {
    if (open) {
      setStart(String(workStart));
      setEnd(String(workEnd));
    }
  }, [open, workStart, workEnd]);

  const handleSave = () => {
    const startNum = start === "" ? 0 : Math.min(23, Math.max(0, Number(start)));
    const endNum = end === "" ? 0 : Math.min(23, Math.max(0, Number(end)));
    onSave(startNum, endNum);
    setOpen(false);
  };

  const handleReset = () => {
    setStart(String(WORK_START_HOUR));
    setEnd(String(WORK_END_HOUR));
  };

  const handleTimeChange = (value: string, setter: (val: string) => void) => {
    if (value === "") {
      setter("");
      return;
    }
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setter(String(num));
    }
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
                <Input
                  id="start-time"
                  type="number"
                  min={0}
                  max={23}
                  value={start}
                  onChange={(e) => handleTimeChange(e.target.value, setStart)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end-time" className="text-xs">{t.endTime}</Label>
                <Input
                  id="end-time"
                  type="number"
                  min={0}
                  max={23}
                  value={end}
                  onChange={(e) => handleTimeChange(e.target.value, setEnd)}
                  className="font-mono"
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
