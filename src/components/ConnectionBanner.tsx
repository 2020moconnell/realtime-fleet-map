import type { ConnectionStatus } from "../types/connection";
import {
  connectionStatusColor,
  connectionStatusText,
  tokens,
} from "../theme/tokens";

interface ConnectionBannerProps {
  status: ConnectionStatus;
}

export function ConnectionBanner({ status }: ConnectionBannerProps) {
  if (status === "open") return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        backgroundColor: connectionStatusColor[status],
        color: tokens.color.text,
        fontFamily: tokens.typography.fontFamily,
        fontSize: tokens.typography.fontSizeMd,
        fontWeight: tokens.typography.fontWeightBold,
        textAlign: "center",
      }}
    >
      {connectionStatusText[status]}
    </div>
  );
}
