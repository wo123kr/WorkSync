"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CITIES } from "@/lib/constants";
import { translations, Language } from "@/lib/i18n";

interface CitySelectorProps {
  onSelect: (city: typeof CITIES[0]) => void;
  selectedCities: typeof CITIES[0][];
  lang: Language;
}

export default function CitySelector({ onSelect, selectedCities, lang }: CitySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const t = translations[lang];

  // Filter out already selected cities
  const availableCities = CITIES.filter(
    (city) => !selectedCities.find((c) => c.name === city.name)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-full min-h-[160px] w-full border-dashed border-2 hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-all group"
        >
          <div className="rounded-full bg-secondary p-4 group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
          </div>
          <span className="text-xs text-muted-foreground font-medium group-hover:text-primary">{t.addCity}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{t.addCity}</DialogTitle>
        </DialogHeader>
        <Command className="border-none shadow-none bg-transparent">
          <CommandInput placeholder={t.searchPlaceholder} className="border-none focus:ring-0" />
          <CommandList>
            <CommandEmpty>{t.noCityFound}</CommandEmpty>
            <CommandGroup heading={t.suggestions}>
              {availableCities.map((city) => {
                const translatedName = t.cities[city.name as keyof typeof t.cities] || city.name;
                return (
                  <CommandItem
                    key={city.name}
                    value={`${city.name} ${translatedName}`}
                    onSelect={() => {
                      onSelect(city);
                      setOpen(false);
                    }}
                    className="cursor-pointer aria-selected:bg-secondary"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{translatedName}</span>
                      <span className="text-xs text-muted-foreground">
                        {city.country} ({city.timezone})
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
