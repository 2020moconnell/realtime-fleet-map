import { WebSocketServer } from 'ws';

const PORT = 8080;
const TICK_MS = 1000;

// Not realistic - just scales up movement per tick so motion is visible
// on a zoomed-out demo map instead of crawling a few meters a second.
const SIM_SPEED_MULTIPLIER = 150;

const FLEET_SIZE = 250;

// Spread starting points across the continental US so the whole-country
// map view has something to look at immediately.
const START_BOUNDS = { minLat: 27, maxLat: 47, minLon: -122, maxLon: -75 };

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createVehicle(id, name) {
  return {
    id,
    name,
    lat: randomBetween(START_BOUNDS.minLat, START_BOUNDS.maxLat),
    lon: randomBetween(START_BOUNDS.minLon, START_BOUNDS.maxLon),
    heading: randomBetween(0, 360),
    speedKph: randomBetween(60, 100),
    status: 'moving',
    updatedAt: new Date().toISOString(),
  };
}

const fleet = Array.from({ length: FLEET_SIZE }, (_, i) =>
  createVehicle(`veh-${i + 1}`, `Vehicle ${i + 1}`),
);

function stepVehicle(vehicle) {
  // Occasionally idle a vehicle or send it back on its way.
  if (Math.random() < 0.02) {
    if (vehicle.status === 'moving') {
      vehicle.status = 'idle';
      vehicle.speedKph = 0;
    } else {
      vehicle.status = 'moving';
      vehicle.speedKph = randomBetween(60, 100);
    }
  }

  if (vehicle.status === 'idle') {
    vehicle.updatedAt = new Date().toISOString();
    return vehicle;
  }

  // Drift heading slightly for a wandering route instead of a straight line.
  vehicle.heading = (vehicle.heading + randomBetween(-15, 15) + 360) % 360;

  const distanceKm =
    (vehicle.speedKph * TICK_MS * SIM_SPEED_MULTIPLIER) / 1000 / 3600;
  const headingRad = (vehicle.heading * Math.PI) / 180;

  // Rough planar approximation - fine at this simulation scale.
  const deltaLat = (distanceKm / 111) * Math.cos(headingRad);
  const deltaLon =
    (distanceKm / (111 * Math.cos((vehicle.lat * Math.PI) / 180))) * Math.sin(headingRad);

  vehicle.lat += deltaLat;
  vehicle.lon += deltaLon;
  vehicle.updatedAt = new Date().toISOString();

  return vehicle;
}

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (socket) => {
  console.log(`client connected (${wss.clients.size} total)`);

  socket.send(JSON.stringify({ type: 'snapshot', vehicles: fleet }));

  socket.on('close', () => {
    console.log(`client disconnected (${wss.clients.size} total)`);
  });
});

setInterval(() => {
  for (const vehicle of fleet) {
    stepVehicle(vehicle);
  }

  const message = JSON.stringify({ type: 'update', vehicles: fleet });
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}, TICK_MS);

console.log(`mock fleet WebSocket server listening on ws://localhost:${PORT}`);
