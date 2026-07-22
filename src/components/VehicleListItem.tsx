import type { Vehicle } from "../types/fleet";
import { tokens } from "../theme/tokens";
import { StatusBadge } from "./StatusBadge";

interface VehicleListItemProps {
  vehicle: Vehicle;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function VehicleListItem({
  vehicle,
  selected,
  onSelect,
}: VehicleListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(vehicle.id)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: tokens.spacing.sm,
          borderRadius: tokens.radius.md,
          border: "none",
          borderLeft: selected
            ? `3px solid ${tokens.color.primary}`
            : "3px solid transparent",
          cursor: "pointer",
          backgroundColor: selected ? "rgba(101, 51, 235, 0.15)" : "transparent",
          color: tokens.color.text,
          fontFamily: tokens.typography.fontFamily,
          display: "flex",
          flexDirection: "column",
          gap: tokens.spacing.xs,
        }}
      >
        <span
          style={{
            fontSize: tokens.typography.fontSizeMd,
            fontWeight: tokens.typography.fontWeightBold,
          }}
        >
          {vehicle.name}
        </span>
        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <StatusBadge status={vehicle.status} />
          <span
            style={{
              fontSize: tokens.typography.fontSizeSm,
              color: tokens.color.textMuted,
            }}
          >
            {Math.round(vehicle.speedKph)} km/h
          </span>
        </span>
      </button>
    </li>
  );
}
