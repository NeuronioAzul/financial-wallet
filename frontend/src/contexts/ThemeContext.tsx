import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { profileService } from "@/services";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

type ThemeMode = "light" | "dark";

interface ThemeContextData {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  syncWithBackend: (theme?: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("theme");
    return (stored as ThemeMode) || "light";
  });

  // Remove legacy contrast setting from localStorage
  useEffect(() => {
    localStorage.removeItem("contrast");
  }, []);

  // Sync with user's saved preferences from backend
  useEffect(() => {
    if (user?.theme_mode) {
      setThemeState(user.theme_mode as ThemeMode);
    }
  }, [user]);

  useEffect(() => {
    const root = document.documentElement;

    console.log("🎨 Theme changed:", { theme });

    // Apply theme
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    console.log("📋 HTML classes:", root.className);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const syncWithBackend = async (newTheme?: ThemeMode) => {
    try {
      const data: any = {};
      if (newTheme !== undefined) data.theme_mode = newTheme;

      if (Object.keys(data).length > 0) {
        await profileService.updateThemeSettings(data);
        toast.success("Configurações salvas com sucesso!");
      }
    } catch (error) {
      console.error("Error syncing theme with backend:", error);
      toast.error("Erro ao salvar configurações de tema");
      throw error;
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    console.log("🔄 setTheme called with:", newTheme, "current theme:", theme);
    setThemeState(newTheme);
    if (user) {
      syncWithBackend(newTheme).catch((err) => {
        console.error("Failed to sync theme:", err);
        // Revert on error
        setThemeState(theme);
      });
    } else {
      console.warn("⚠️ No user logged in, theme not synced to backend");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        syncWithBackend,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
