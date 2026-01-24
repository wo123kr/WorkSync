"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCcw } from "lucide-react";
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
  const [start, setStart] = useState(workStart);
  const [end, setEnd] = useState(workEnd);
  const t = translations[lang];

  const handleSave = () => {
    onSave(Number(start), Number(end));
    setOpen(false);
  };

  const handleReset = () => {
    setStart(WORK_START_HOUR);
    setEnd(WORK_END_HOUR);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.globalSettings}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">{t.workHours}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">{t.startTime} (0-23)</Label>
                <Input
                  id="start-time"
                  type="number"
                  min={0}
                  max={23}
                  value={start}
                  onChange={(e) => setStart(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">{t.endTime} (0-23)</Label>
                <Input
                  id="end-time"
                  type="number"
                  min={0}
                  max={23}
                  value={end}
                  onChange={(e) => setEnd(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 text-xs">
              <RefreshCcw className="w-3 h-3" />
              Reset Defaults
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button>
              <Button onClick={handleSave}>{t.save}</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
