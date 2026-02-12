import { createContext, useContext } from "react";

// 1. Définition des types
export type ThemeMode = "light" | "dark";

type ThemeContextValue = {
    mode: ThemeMode;
    toggleTheme: () => void;
};

// 2. Création du contexte
export const ThemeContext = createContext<ThemeContextValue | null>(null);

// 3. Le Hook personnalisé (exporté ici pour éviter l'erreur de linter)
export function useThemeMode() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useThemeMode must be used inside ThemeProvider"
        );
    }

    return context;
}