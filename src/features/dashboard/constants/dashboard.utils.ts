export type Trend = "up" | "down";

export interface TrendResult {
    pct: number;
    trend: Trend;
}

export function pctChange(current: number, previous: number): TrendResult {
    if (!previous) return { pct: 0, trend: "up" };
    const pct = ((current - previous) / previous) * 100;
    return { pct: Math.abs(pct), trend: pct >= 0 ? "up" : "down" };
}