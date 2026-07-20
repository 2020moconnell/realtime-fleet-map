import { useEffect, useRef, useState } from "react";
import type { FleetSocketMessage, Vehicle } from "../types/fleet";

export type ConnectionStatus = "connecting" | "open" | "closed";

const RECONNECT_DELAY_MS = 2000;

export function useFleetSocket(url: string) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let socket: WebSocket;
    let cancelled = false;

    function connect() {
      socket = new WebSocket(url);
      setStatus("connecting");

      socket.onopen = () => {
        setStatus("open");
      };

      socket.onmessage = (event) => {
        const message: FleetSocketMessage = JSON.parse(event.data);
        setVehicles(message.vehicles);
      };

      socket.onclose = () => {
        setStatus("closed");
        if (!cancelled) {
          reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimeoutRef.current);
      socket.close();
    };
  }, [url]);

  return { vehicles, status };
}
