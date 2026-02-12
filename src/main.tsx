import "antd/dist/reset.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App";
import { queryClient } from "./lib/react-query";
import {ThemeProvider} from "./lib/theme/ThemeProvider.tsx";

// ✅ AJOUT DE L'IMPORT MANQUANT ICI
// Assure-toi que le chemin pointe bien vers ton fichier ThemeProvider.tsx

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element #root not found");
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        {/* Le ThemeProvider englobe tout pour que les tokens Antd soient dispos partout */}
        <ThemeProvider>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <App />
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
);