import type { VehicleStatus } from "../types/fleet";

export const tokens = {
  color: {
    primary: "#6533eb",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    statusMoving: "#22c55e",
    statusIdle: "#f59e0b",
    connectionOpen: "#22c55e",
    connectionConnecting: "#f59e0b",
    connectionClosed: "#ef4444",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSizeSm: "12px",
    fontSizeMd: "14px",
    fontSizeLg: "18px",
    fontWeightRegular: 400,
    fontWeightBold: 600,
  },
  radius: {
    sm: "4px",
    md: "8px",
    full: "9999px",
  },
} as const;

export const statusColor: Record<VehicleStatus, string> = {
  moving: tokens.color.statusMoving,
  idle: tokens.color.statusIdle,
};
