import { FleetMap } from "./components/FleetMap";
import { useFleetSocket } from "./hooks/useFleetSocket";

function App() {
  const { vehicles, status } = useFleetSocket("ws://localhost:8080");
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FleetMap vehicles={vehicles} />
    </div>
  );
}

export default App;
