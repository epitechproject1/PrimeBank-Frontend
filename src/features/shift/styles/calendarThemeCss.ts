// ./features/planning/shift/components/calendarThemeCss.ts
import type { GlobalToken } from "antd/es/theme/interface";

export function buildCalendarCss(token: GlobalToken): string {
    return `
    .fc { font-family: ${token.fontFamily}; color: ${token.colorText}; }
    .fc .fc-toolbar { padding: 16px 20px 8px; }
    .fc .fc-toolbar-title { font-size: 16px; font-weight: 700; color: ${token.colorText}; }

    .fc .fc-button {
      background: ${token.colorBgContainer} !important;
      border: 1px solid ${token.colorBorderSecondary} !important;
      color: ${token.colorText} !important;
      border-radius: 8px !important;
      font-size: 12px !important;
      box-shadow: none !important;
    }
    .fc .fc-button:hover { background: ${token.colorFillTertiary} !important; }
    .fc .fc-button-primary:not(:disabled).fc-button-active {
      background: ${token.colorFillSecondary} !important;
      color: ${token.colorPrimary} !important;
      border-color: ${token.colorPrimaryBorder} !important;
    }

    .fc .fc-col-header-cell-cushion {
      font-size: 12px; font-weight: 600;
      color: ${token.colorTextSecondary};
      text-transform: uppercase; letter-spacing: 0.5px;
      padding: 10px 0;
      text-decoration: none !important;
    }

    .fc .fc-timegrid-slot { border-color: ${token.colorBorderSecondary} !important; }
    .fc .fc-timegrid-slot-label { font-size: 11px; color: ${token.colorTextTertiary}; }

    .fc .fc-event {
      border-radius: 6px !important;
      border-width: 1px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      cursor: pointer;
    }
    .fc .fc-event:hover { filter: brightness(0.96); }
    .fc .fc-daygrid-event { border-radius: 4px !important; }

    .fc .fc-highlight { background: ${token.colorPrimaryBg} !important; }
    .fc .fc-day-today { background: ${token.colorFillQuaternary} !important; }
    .fc .fc-scrollgrid { border-radius: 0 !important; border: none !important; }
    .fc td, .fc th { border-color: ${token.colorBorderSecondary} !important; }

    .fc .fc-now-indicator-line { border-color: ${token.colorError} !important; }
    .fc .fc-now-indicator-arrow { border-top-color: ${token.colorError} !important; }
  `;
}