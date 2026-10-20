import { useEffect, useState, useMemo } from "react";
import {
  Sunrise,
  Sunset,
  Moon,
  Clock3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";

interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export const PrayerTimes = () => {
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;
    const fetchPrayerTimes = async () => {
      try {
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${today.getFullYear()}`;

        const url = `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Salta&country=AR&method=13`;

        const response = await fetch(url);
        if (!response.ok) return;
        const data = await response.json();

        if (isMounted && data?.data?.timings) {
          setTimings(data.data.timings);
        }
      } catch (error) {
        console.warn("Prayer times fetch error:", error);
      }
    };

    fetchPrayerTimes();
    return () => {
      isMounted = false;
    };
  }, []);

  const prayers = useMemo(() => {
    if (!timings) return [];
    return [
      { name: "Fajr", label: "Fajr", time: timings.Fajr, icon: <Moon className="h-3.5 w-3.5" /> },
      { name: "Sunrise", label: "Amanecer", time: timings.Sunrise, icon: <Sunrise className="h-3.5 w-3.5" /> },
      { name: "Dhuhr", label: "Dhuhr", time: timings.Dhuhr, icon: <Clock3 className="h-3.5 w-3.5" /> },
      { name: "Asr", label: "Asr", time: timings.Asr, icon: <Clock3 className="h-3.5 w-3.5" /> },
      { name: "Maghrib", label: "Maghrib", time: timings.Maghrib, icon: <Sunset className="h-3.5 w-3.5" /> },
      { name: "Isha", label: "Isha", time: timings.Isha, icon: <Moon className="h-3.5 w-3.5" /> },
    ];
  }, [timings]);

  // Determine current/next prayer
  const nextPrayerName = useMemo(() => {
    if (!timings) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayerOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
    for (const name of prayerOrder) {
      const timeStr = timings[name];
      if (!timeStr) continue;
      const [h, m] = timeStr.split(":").map(Number);
      const prayerMinutes = h * 60 + m;
      if (prayerMinutes > currentMinutes) {
        return name;
      }
    }
    return "Fajr";
  }, [timings]);

  if (!timings || prayers.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 mt-3 mb-2">
      {/* Compact toggle bar */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="group inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/70 bg-card/60 backdrop-blur-md text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all shadow-2xs"
          aria-expanded={isExpanded}
        >
          <Clock3 className="h-3.5 w-3.5 text-primary" />
          <span>
            {t("prayer.next") || "Próxima oración"}:{" "}
            <strong className="text-foreground">
              {nextPrayerName} ({timings[nextPrayerName as keyof PrayerTimings] || ""})
            </strong>
          </span>
          {isExpanded ? (
            <ChevronUp className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
          ) : (
            <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
          )}
        </button>
      </div>

      {/* Expanded prayer times list */}
      {isExpanded && (
        <div className="mt-2.5 p-2 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md animate-in fade-in-50 zoom-in-95 duration-200">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {prayers.map((prayer) => {
              const isNext = prayer.name === nextPrayerName;
              return (
                <div
                  key={prayer.name}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs transition-all",
                    isNext
                      ? "border-primary/50 bg-primary/10 text-primary font-semibold shadow-2xs"
                      : "border-border/60 bg-background/50 text-foreground/80"
                  )}
                >
                  <span className={isNext ? "text-primary" : "text-muted-foreground"}>
                    {prayer.icon}
                  </span>
                  <span>{prayer.label}</span>
                  <span className="font-mono font-medium">{prayer.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};