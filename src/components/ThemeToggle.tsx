import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        "hover:shadow-glow hover:scale-105 active:scale-95",
        "border-border bg-background/80 backdrop-blur-sm",
        "dark:border-border dark:bg-background/20"
      )}
      aria-label="Toggle theme"
    >
      <Sun 
        className={cn(
          "h-4 w-4 transition-all duration-300",
          theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
        )} 
      />
      <Moon 
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        )} 
      />
    </Button>
  );
}