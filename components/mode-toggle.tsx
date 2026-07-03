import { Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun size={12} /> : <Moon size={12} />}
      <span className="hidden sm:inline">{isDark ? "light" : "dark"}</span>
    </button>
  );
}
