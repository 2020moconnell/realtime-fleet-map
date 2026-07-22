import type { Vehicle } from "../types/fleet";
import { tokens } from "../theme/tokens";
import { VehicleListItem } from "./VehicleListItem";

interface VehicleSidebarProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
}

export function VehicleSidebar({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: VehicleSidebarProps) {
  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        height: "100%",
        overflowY: "auto",
        boxSizing: "border-box",
        padding: tokens.spacing.md,
        backgroundColor: tokens.color.surface,
        color: tokens.color.text,
        fontFamily: tokens.typography.fontFamily,
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: tokens.spacing.md,
          fontSize: tokens.typography.fontSizeLg,
          fontWeight: tokens.typography.fontWeightBold,
        }}
      >
        Fleet ({vehicles.length})
      </h2>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: tokens.spacing.xs,
        }}
      >
        {vehicles.map((vehicle) => (
          <VehicleListItem
            key={vehicle.id}
            vehicle={vehicle}
            selected={vehicle.id === selectedVehicleId}
            onSelect={onSelectVehicle}
          />
        ))}
      </ul>
    </aside>
  );
}
