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
type ContrastMode = "normal" | "high";

interface ThemeContextData {
  theme: ThemeMode;
  contrast: ContrastMode;
  setTheme: (theme: ThemeMode) => void;
  setContrast: (contrast: ContrastMode) => void;
  toggleTheme: () => void;
  toggleContrast: () => void;
  syncWithBackend: (
    theme?: ThemeMode,
    contrast?: ContrastMode
  ) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("theme");
    return (stored as ThemeMode) || "light";
  });

  const [contrast, setContrastState] = useState<ContrastMode>(() => {
    const stored = localStorage.getItem("contrast");
    return (stored as ContrastMode) || "normal";
  });

  // Sync with user's saved preferences from backend
  useEffect(() => {
    if (user?.theme_mode && user?.contrast_mode) {
      setThemeState(user.theme_mode as ThemeMode);
      setContrastState(user.contrast_mode as ContrastMode);
    }
  }, [user]);

  useEffect(() => {
    const root = document.documentElement;

    console.log("🎨 Theme changed:", { theme, contrast });

    // Apply theme
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply contrast
    if (contrast === "high") {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    console.log("📋 HTML classes:", root.className);

    localStorage.setItem("theme", theme);
    localStorage.setItem("contrast", contrast);
  }, [theme, contrast]);

  const syncWithBackend = async (
    newTheme?: ThemeMode,
    newContrast?: ContrastMode
  ) => {
    try {
      const data: any = {};
      if (newTheme !== undefined) data.theme_mode = newTheme;
      if (newContrast !== undefined) data.contrast_mode = newContrast;

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
      // Pass both values to backend
      syncWithBackend(newTheme, contrast).catch((err) => {
        console.error("Failed to sync theme:", err);
        // Revert on error
        setThemeState(theme);
      });
    } else {
      console.warn("⚠️ No user logged in, theme not synced to backend");
    }
  };

  const setContrast = (newContrast: ContrastMode) => {
    console.log("🔄 setContrast called with:", newContrast, "current contrast:", contrast);
    setContrastState(newContrast);
    if (user) {
      // Pass both values to backend
      syncWithBackend(theme, newContrast).catch((err) => {
        console.error("Failed to sync contrast:", err);
        // Revert on error
        setContrastState(contrast);
      });
    } else {
      console.warn("⚠️ No user logged in, contrast not synced to backend");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const toggleContrast = () => {
    const newContrast = contrast === "normal" ? "high" : "normal";
    setContrast(newContrast);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        contrast,
        setTheme,
        setContrast,
        toggleTheme,
        toggleContrast,
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
