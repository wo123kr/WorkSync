"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share2, Copy, Link2, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareMenuProps {
  onCopyText: () => void;
  onCopyLink: () => void;
  onAddToCalendar: () => void;
  copied: boolean;
  linkCopied: boolean;
  labels: {
    share: string;
    copy: string;
    copied: string;
    shareLink: string;
    linkCopied: string;
    calendar: string;
  };
}

export default function ShareMenu({
  onCopyText,
  onCopyLink,
  onAddToCalendar,
  copied,
  linkCopied,
  labels,
}: ShareMenuProps) {
  const [open, setOpen] = React.useState(false);

  const handleCopyText = () => {
    onCopyText();
  };

  const handleCopyLink = () => {
    onCopyLink();
  };

  const handleCalendar = () => {
    onAddToCalendar();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 text-xs gap-1.5",
            (copied || linkCopied) && "text-[hsl(var(--work))] border-[hsl(var(--work)/0.3)]"
          )}
        >
          {copied || linkCopied ? (
            <Check className="w-3 h-3" />
          ) : (
            <Share2 className="w-3 h-3" />
          )}
          {labels.share}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <div className="flex flex-col">
          <button
            onClick={handleCopyText}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left",
              copied && "text-[hsl(var(--work))]"
            )}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? labels.copied : labels.copy}
          </button>
          <button
            onClick={handleCopyLink}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left",
              linkCopied && "text-[hsl(var(--work))]"
            )}
          >
            {linkCopied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            {linkCopied ? labels.linkCopied : labels.shareLink}
          </button>
          <button
            onClick={handleCalendar}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
          >
            <Calendar className="w-4 h-4" />
            {labels.calendar}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
