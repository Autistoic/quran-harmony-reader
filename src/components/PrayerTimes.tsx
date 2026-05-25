// src/components/PrayerTimes.tsx

import { useEffect, useState } from "react";
import {
  Sunrise,
  Sunset,
  Moon,
  Clock3,
} from "lucide-react";

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

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const today = new Date();

        const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${today.getFullYear()}`;

        const url = `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Salta&country=AR&method=3`;

        const response = await fetch(url);
        const data = await response.json();

        setTimings(data.data.timings);
      } catch (error) {
        console.error("Prayer times error:", error);
      }
    };

    fetchPrayerTimes();
  }, []);

  if (!timings) return null;

  const prayers = [
    {
      name: "Fajr",
      time: timings.Fajr,
      icon: <Moon className="h-3.5 w-3.5" />,
    },
    {
      name: "Sunrise",
      time: timings.Sunrise,
      icon: <Sunrise className="h-3.5 w-3.5" />,
    },
    {
      name: "Dhuhr",
      time: timings.Dhuhr,
      icon: <Clock3 className="h-3.5 w-3.5" />,
    },
    {
      name: "Asr",
      time: timings.Asr,
      icon: <Clock3 className="h-3.5 w-3.5" />,
    },
    {
      name: "Maghrib",
      time: timings.Maghrib,
      icon: <Sunset className="h-3.5 w-3.5" />,
    },
    {
      name: "Isha",
      time: timings.Isha,
      icon: <Moon className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 mt-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs bg-background/60 backdrop-blur-sm"
          >
            {prayer.icon}

            <span className="text-muted-foreground">
              {prayer.name}
            </span>

            <span className="font-medium">
              {prayer.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};