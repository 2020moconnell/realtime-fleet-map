import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Vehicle } from "../types/fleet";
import { statusColor, tokens } from "../theme/tokens";

const INITIAL_CENTER: [number, number] = [-98.5795, 39.8283];
const INITIAL_ZOOM = 3.5;

interface FleetMapProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
}

function vehiclesToGeoJSON(
  vehicles: Vehicle[],
  selectedVehicleId: string | null,
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
        speedKph: vehicle.speedKph,
        selected: vehicle.id === selectedVehicleId,
      },
    })),
  };
}

export function FleetMap({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: FleetMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const vehiclesRef = useRef(vehicles);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  vehiclesRef.current = vehicles;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    mapRef.current.on("load", () => {
      mapRef.current!.addSource("vehicles", {
        type: "geojson",
        data: vehiclesToGeoJSON(vehicles, selectedVehicleId),
      });

      mapRef.current!.addLayer({
        id: "vehicles-layer",
        type: "circle",
        source: "vehicles",
        paint: {
          "circle-radius": ["case", ["get", "selected"], 10, 6],
          "circle-color": [
            "match",
            ["get", "status"],
            "moving",
            statusColor.moving,
            "idle",
            statusColor.idle,
            tokens.color.textMuted,
          ],
          "circle-stroke-width": ["case", ["get", "selected"], 2, 0],
          "circle-stroke-color": tokens.color.primary,
        },
      });

      mapRef.current!.on("mouseenter", "vehicles-layer", (e) => {
        mapRef.current!.getCanvas().style.cursor = "pointer";

        const feature = e.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;

        const { name, status, speedKph } = feature.properties as {
          name: string;
          status: string;
          speedKph: number;
        };

        popupRef
          .current!.setLngLat(feature.geometry.coordinates as [number, number])
          .setHTML(
            `<div style="font-family: ${tokens.typography.fontFamily}; font-size: ${tokens.typography.fontSizeSm}; color: ${tokens.color.background};">
            <strong>${name}</strong><br />
            ${status} · ${Math.round(speedKph)} km/h
            </div>`,
          )
          .addTo(mapRef.current!);
      });

      mapRef.current!.on("mouseleave", "vehicles-layer", () => {
        mapRef.current!.getCanvas().style.cursor = "";
        popupRef.current!.remove();
      });

      mapRef.current!.on("click", "vehicles-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const { id } = feature.properties as { id: string };
        onSelectVehicle(id);
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

    source.setData(vehiclesToGeoJSON(vehicles, selectedVehicleId));
  }, [vehicles, selectedVehicleId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedVehicleId) return;

    const vehicle = vehiclesRef.current.find((v) => v.id === selectedVehicleId);
    if (!vehicle) return;

    map.flyTo({ center: [vehicle.lon, vehicle.lat], zoom: 8 });
  }, [selectedVehicleId]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
