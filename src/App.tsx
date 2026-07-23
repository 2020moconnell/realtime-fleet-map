import { useState } from "react";
import { FleetMap } from "./components/FleetMap";
import { VehicleSidebar } from "./components/VehicleSidebar";
import { useFleetSocket } from "./hooks/useFleetSocket";
import { ConnectionBanner } from "./components/ConnectionBanner";

function App() {
  const { vehicles, status } = useFleetSocket("ws://localhost:8080");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  );

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      <ConnectionBanner status={status} />
      <VehicleSidebar
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={setSelectedVehicleId}
      />
      <div style={{ flex: 1 }}>
        <FleetMap
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
        />
      </div>
    </div>
  );
}

export default App;
