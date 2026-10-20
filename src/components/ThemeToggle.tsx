import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/i18n";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 w-9 px-0 rounded-full border-border/70 bg-card/70 hover:bg-accent/20 focus-visible:ring-primary ${className || ""}`}
          aria-label={t("theme.toggle") || "Toggle theme"}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-600 dark:text-amber-400" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[8rem] bg-popover/95 backdrop-blur-md">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`cursor-pointer flex items-center gap-2 text-xs py-2 ${theme === "light" ? "font-semibold text-primary" : ""}`}
        >
          <Sun className="h-4 w-4 text-amber-600" />
          <span>{t("theme.light") || "Claro"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`cursor-pointer flex items-center gap-2 text-xs py-2 ${theme === "dark" ? "font-semibold text-primary" : ""}`}
        >
          <Moon className="h-4 w-4 text-primary" />
          <span>{t("theme.dark") || "Oscuro"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`cursor-pointer flex items-center gap-2 text-xs py-2 ${theme === "system" ? "font-semibold text-primary" : ""}`}
        >
          <Laptop className="h-4 w-4 text-muted-foreground" />
          <span>{t("theme.system") || "Sistema"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
