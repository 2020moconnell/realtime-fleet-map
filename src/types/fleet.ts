export type VehicleStatus = 'moving' | 'idle';

export interface Vehicle {
  id: string;
  name: string;
  lat: number;
  lon: number;
  heading: number;
  speedKph: number;
  status: VehicleStatus;
  updatedAt: string;
}

export type FleetSocketMessage =
  | { type: 'snapshot'; vehicles: Vehicle[] }
  | { type: 'update'; vehicles: Vehicle[] };
