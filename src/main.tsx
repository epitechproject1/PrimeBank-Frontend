// ./main.tsx

import "antd/dist/reset.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ConfigProvider } from "antd";
import frFR from "antd/locale/fr_FR";

import dayjs from "dayjs";
import "dayjs/locale/fr";

import App from "./App";
import { queryClient } from "./lib/react-query";
import { ThemeProvider } from "./lib/theme/ThemeProvider";

// 🌍 Configuration globale langue
dayjs.locale("fr");

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element #root not found");
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <ConfigProvider locale={frFR}>
            <ThemeProvider>
                <BrowserRouter>
                    <QueryClientProvider client={queryClient}>
                        <App />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </BrowserRouter>
            </ThemeProvider>
        </ConfigProvider>
    </React.StrictMode>
);