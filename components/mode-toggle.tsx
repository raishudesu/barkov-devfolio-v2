import { Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "@/components/theme-provider";

function isDark(theme: string): boolean {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return theme === "dark";
}

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = isDark(theme);

  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors"
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
    >
      {dark ? <Sun size={12} /> : <Moon size={12} />}
      <span className="hidden sm:inline">{dark ? "light" : "dark"}</span>
    </button>
  );
}
