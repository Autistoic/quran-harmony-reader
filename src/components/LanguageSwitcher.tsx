import React from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation, SupportedLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "dropdown" | "toggle";
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
  variant = "dropdown",
}) => {
  const { language, setLanguage, languages, t } = useTranslation();

  if (variant === "toggle") {
    return (
      <div className={cn("inline-flex items-center rounded-md border border-border bg-card p-0.5", className)}>
        {languages.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={`Switch to ${lang.label}`}
              aria-pressed={isActive}
            >
              {lang.code.toUpperCase()}
            </button>
          );
        })}
      </div>
    );
  }

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-9 gap-1.5 px-2.5 rounded-xl text-xs font-medium border-border/70 bg-card/70 hover:bg-accent/20 focus-visible:ring-primary", className)}
          aria-label={t("nav.language")}
        >
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-semibold">{currentLang.code.toUpperCase()}</span>
          <span className="hidden sm:inline text-muted-foreground font-normal">({currentLang.nativeLabel})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {languages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="flex items-center justify-between text-xs cursor-pointer py-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-1 py-0.5 rounded bg-muted font-bold">
                  {lang.code.toUpperCase()}
                </span>
                <span>{lang.nativeLabel}</span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default LanguageSwitcher;
