import React, { useEffect, useState } from "react";
import { ConfigProvider, App as AntdApp, theme as antdTheme } from "antd";
// 👇 Important : On importe le contexte et le types depuis le fichier voisin
import { ThemeContext, ThemeMode } from "./ThemeContext";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>(() => {
        // On récupère la préférence ou 'light' par défaut
        return (localStorage.getItem("theme") as ThemeMode) ?? "light";
    });

    useEffect(() => {
        localStorage.setItem("theme", mode);

        // Applique une classe ou un style au body pour éviter les flashs blancs
        if (mode === "dark") {
            document.body.style.backgroundColor = "#000000";
            document.body.style.color = "#ffffff";
        } else {
            document.body.style.backgroundColor = "#ffffff";
            document.body.style.color = "#000000";
        }
    }, [mode]);

    // Configuration de l'algorithme Ant Design
    const algorithm =
        mode === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm;

    const toggleTheme = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ConfigProvider theme={{ algorithm }}>
                {/* AntdApp permet aux messages/modales d'hériter du thème correct */}
                <AntdApp>
                    {children}
                </AntdApp>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
}