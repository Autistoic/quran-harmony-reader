import { Link, useLocation } from "react-router-dom";
import { BookOpen, Sparkles } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const isQuran = location.pathname === "/" || location.pathname === "/word";
  const isWird = location.pathname === "/wird-sharif";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Lockup */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1"
          aria-label="Quran Harmony Reader - Inicio"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-xs">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm sm:text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
                Quran Harmony
              </span>
              <span className="font-quran-arabic text-primary text-xs font-normal">
                مصحف
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              {t("nav.readerSubtitle") || "Lectura y Recitación"}
            </span>
          </div>
        </Link>

        {/* Center: Navigation segmented control */}
        <nav className="flex items-center p-1 rounded-xl bg-card border border-border/70 shadow-2xs">
          <Link
            to="/"
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
              isQuran
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Surahs</span>
          </Link>
          <Link
            to="/wird-sharif"
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
              isWird
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Wird Sharif</span>
          </Link>
        </nav>

        {/* Right: Controls & Preferences */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
