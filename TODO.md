# Roadmap / TODO

Living planning doc for the fleet map project. Update as decisions get made or scope changes.

## Data model

What a vehicle record could carry, grouped by category. Check = modeled today in `src/types/fleet.ts` / `server/mock-server.js`.

- [x] Identity: `id`, `name`
- [x] Live position: `lat`, `lon`, `heading`, `speedKph`
- [x] Status: `moving` / `idle`
- [x] `updatedAt` timestamp
- [ ] Connectivity/staleness: `offline` status, last-seen vs. last-updated distinction
- [ ] Assignment: vehicle type, assigned driver, depot/fleet group
- [ ] Trip context: destination, ETA, assigned route
- [ ] Geofences: depot / delivery zone boundaries, enter/exit detection
- [ ] Telemetry: fuel or battery level, odometer
- [ ] History: breadcrumb trail of past positions per vehicle
- [ ] Events/alerts: speeding, harsh braking, idle-too-long, geofence violations

**Open question:** how much fabricated telemetry is worth adding vs. how much is better spent going deep on fewer fields (e.g. skip fault codes, keep geofences + alerts, since those exercise more interesting UI/state).

## Feature checklist (maps to portfolio skills list)

- [x] Modern React + TypeScript
- [x] Clean project structure (components / hooks / types / theme / server)
- [x] WebSockets + real-time data (mock server, reconnect logic)
- [x] Displaying data on a map (MapLibre, GeoJSON source + circle layer)
- [x] Component architecture — `StatusBadge` (reusable dot+label), `VehicleListItem` (built from `StatusBadge`), `VehicleSidebar` (built from `VehicleListItem`). `FleetMap` is still one big component, but the sidebar side is properly decomposed now.
- [x] State management with a defensible design — `selectedVehicleId` lives in `App.tsx` (the shared ancestor of sidebar + map) via plain `useState<string | null>`. Sidebar/list items are controlled components with no state of their own, just `selected`/`onSelect` props. Chose plain lifted state over Context/a store since there are only two consumers.
- [x] Token-based styling actually applied — sidebar UI (`VehicleSidebar`, `VehicleListItem`, `StatusBadge`) is styled entirely from `theme/tokens.ts` (spacing, typography, color, radius). Still just the sidebar; map canvas itself has no chrome to theme.
- [ ] Performance under real-time updates — `setData` pattern is good, but nothing stresses it yet (no memoization, no second live-updating surface like a list to show it staying smooth).
- [ ] Map marker interactivity — hover tooltip (quick glance: name/status/speed) and click-to-open detail (fuller info, pinned until dismissed). Two distinct interactions, neither built yet.

## Proposed next slice

1. Decide on the data model additions above (which fields earn their place).
2. ~~Add a sidebar/list of vehicles next to the map~~ — done: `VehicleSidebar` renders live, clicking a row updates `selectedVehicleId` in `App.tsx` and highlights that row.
3. Selection state: list side done (click a vehicle in the list → highlights in the list). **Map side still pending** — `FleetMap` doesn't yet receive `selectedVehicleId` or react to it (no highlight, no fly-to). That's the immediate next step.
4. Add marker interactivity on the map itself: hover tooltip + click-to-open detail popup/panel.
5. Apply theme tokens to the new UI chrome.
6. Add one alert-worthy condition (e.g. idle-too-long) to exercise state + component composition together.
