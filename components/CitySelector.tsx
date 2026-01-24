"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CITIES } from "@/lib/constants";
import { translations, Language, countryNames, cityNames } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CitySelectorProps {
  onSelect: (city: typeof CITIES[0]) => void;
  selectedCities: typeof CITIES[0][];
  lang: Language;
}

export default function CitySelector({ onSelect, selectedCities, lang }: CitySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const t = translations[lang];

  const availableCities = CITIES.filter(
    (city) => !selectedCities.find((c) => c.name === city.name)
  );

  // Filter cities based on search query (city name or country name in any language)
  const filteredCities = React.useMemo(() => {
    if (!search.trim()) return availableCities;

    const query = search.toLowerCase().trim();

    return availableCities.filter((city) => {
      // Check city name (English)
      if (city.name.toLowerCase().includes(query)) return true;

      // Check translated city name
      const cityTrans = cityNames[city.name];
      if (cityTrans) {
        for (const langKey of Object.keys(cityTrans) as Language[]) {
          if (cityTrans[langKey].toLowerCase().includes(query)) return true;
        }
      }

      // Check country name (English)
      if (city.country.toLowerCase().includes(query)) return true;

      // Check translated country name
      const countryTrans = countryNames[city.country];
      if (countryTrans) {
        for (const langKey of Object.keys(countryTrans) as Language[]) {
          if (countryTrans[langKey].toLowerCase().includes(query)) return true;
        }
      }

      return false;
    });
  }, [search, availableCities]);

  // Group cities by country for display
  const groupedCities = React.useMemo(() => {
    const groups: Record<string, typeof CITIES> = {};
    for (const city of filteredCities) {
      if (!groups[city.country]) {
        groups[city.country] = [];
      }
      groups[city.country].push(city);
    }
    return groups;
  }, [filteredCities]);

  const handleSelect = (city: typeof CITIES[0]) => {
    onSelect(city);
    setSearch("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch(""); }}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-dashed h-full">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 h-full">
            <Plus className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t.addCity}</span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3">
          <DialogTitle>{t.addCity}</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-3">
          <Input
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
            autoFocus
          />
        </div>

        <ScrollArea className="h-[320px] px-2 pb-2">
          {filteredCities.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t.noCityFound}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedCities).map(([country, cities]) => {
                const countryTrans = countryNames[country]?.[lang] || country;
                return (
                  <div key={country}>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground sticky top-0 bg-popover">
                      {countryTrans}
                    </div>
                    <div className="space-y-0.5">
                      {cities.map((city) => {
                        const cityTrans = cityNames[city.name]?.[lang] || city.name;
                        return (
                          <button
                            key={city.name}
                            onClick={() => handleSelect(city)}
                            className={cn(
                              "w-full flex items-center justify-between px-2 py-2 rounded-md text-sm",
                              "hover:bg-accent transition-colors text-left"
                            )}
                          >
                            <span>{cityTrans}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {city.timezone.split('/').pop()?.replace('_', ' ')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
