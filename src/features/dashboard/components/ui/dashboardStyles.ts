import { useEffect } from "react";

const ANIM_STYLES = `
@keyframes dashFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.dash-fade-up {
  animation: dashFadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.dash-d0 { animation-delay: 0.00s; }
.dash-d1 { animation-delay: 0.07s; }
.dash-d2 { animation-delay: 0.14s; }
.dash-d3 { animation-delay: 0.21s; }
.dash-d4 { animation-delay: 0.28s; }
.dash-d5 { animation-delay: 0.35s; }
.dash-d6 { animation-delay: 0.42s; }
.dash-d7 { animation-delay: 0.49s; }

.dash-kpi-card {
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}
.dash-kpi-card:hover {
  transform: translateY(-3px);
}
`;

export function useInjectDashboardStyles() {
    useEffect(() => {
        if (typeof document === "undefined") return;
        if (document.getElementById("dash-anim-styles")) return;

        const el = document.createElement("style");
        el.id = "dash-anim-styles";
        el.textContent = ANIM_STYLES;
        document.head.appendChild(el);
    }, []);
}