"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/lib/i18n";

interface LanguageSelectorProps {
  currentLang: Language;
  onSelect: (lang: Language) => void;
}

export default function LanguageSelector({ currentLang, onSelect }: LanguageSelectorProps) {
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
  ];

  return (
    <Select value={currentLang} onValueChange={(value) => onSelect(value as Language)}>
      <SelectTrigger className="w-[140px] h-9 bg-secondary/50 backdrop-blur-sm border-border rounded-lg text-sm font-medium transition-colors hover:bg-secondary/80">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
