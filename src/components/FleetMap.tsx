import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Vehicle } from "../types/fleet";
import { statusColor, tokens } from "../theme/tokens";

const INITIAL_CENTER: [number, number] = [-98.5795, 39.8283];
const INITIAL_ZOOM = 3.5;

interface FleetMapProps {
  vehicles: Vehicle[];
}

function vehiclesToGeoJSON(
  vehicles: Vehicle[],
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: vehicles.map((vehicle) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [vehicle.lon, vehicle.lat],
      },
      properties: {
        id: vehicle.id,
        name: vehicle.name,
        status: vehicle.status,
      },
    })),
  };
}

export function FleetMap({ vehicles }: FleetMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current.on("load", () => {
      mapRef.current!.addSource("vehicles", {
        type: "geojson",
        data: vehiclesToGeoJSON(vehicles),
      });

      mapRef.current!.addLayer({
        id: "vehicles-layer",
        type: "circle",
        source: "vehicles",
        paint: {
          "circle-radius": 6,
          "circle-color": [
            "match",
            ["get", "status"],
            "moving",
            statusColor.moving,
            "idle",
            statusColor.idle,
            tokens.color.textMuted,
          ],
        },
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource("vehicles") as
      | maplibregl.GeoJSONSource
      | undefined;
    if (!source) return;

    source.setData(vehiclesToGeoJSON(vehicles));
  }, [vehicles]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
