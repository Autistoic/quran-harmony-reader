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
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-1 px-3 sm:gap-4 sm:px-4">
        {/* Brand Lockup */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-xl p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Quran Harmony Reader - Inicio"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-xs">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="hidden flex-col sm:flex">
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
        <nav aria-label={t("nav.primary") || "Main navigation"} className="flex shrink-0 items-center rounded-xl border border-border/70 bg-card p-1 shadow-2xs">
          <Link
            to="/"
            aria-label="Surahs"
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all sm:gap-1.5 sm:px-3",
              isQuran
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Surahs</span>
          </Link>
          <Link
            to="/wird-sharif"
            aria-label="Wird Sharif"
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all sm:gap-1.5 sm:px-3",
              isWird
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Wird Sharif</span>
          </Link>
        </nav>

        {/* Right: Controls & Preferences */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
