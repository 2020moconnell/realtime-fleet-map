import type { VehicleStatus } from "../types/fleet";
import { statusColor, tokens } from "../theme/tokens";

interface StatusBadgeProps {
  status: VehicleStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: tokens.spacing.xs,
        fontSize: tokens.typography.fontSizeSm,
        color: tokens.color.textMuted,
        textTransform: "capitalize",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: tokens.radius.full,
          backgroundColor: statusColor[status],
        }}
      />
      {status}
    </span>
  );
}
