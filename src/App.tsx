import { useState } from "react";
import { FleetMap } from "./components/FleetMap";
import { VehicleSidebar } from "./components/VehicleSidebar";
import { useFleetSocket } from "./hooks/useFleetSocket";

function App() {
  const { vehicles } = useFleetSocket("ws://localhost:8080");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  );

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      <VehicleSidebar
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={setSelectedVehicleId}
      />
      <div style={{ flex: 1 }}>
        <FleetMap vehicles={vehicles} />
      </div>
    </div>
  );
}

export default App;
