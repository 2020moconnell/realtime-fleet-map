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
- [x] WebSockets + real-time data (mock server, reconnect logic, connection status surfaced to the user via `ConnectionBanner`)
- [x] Displaying data on a map (MapLibre, GeoJSON source + circle layer)
- [x] Component architecture — `StatusBadge` (reusable dot+label), `VehicleListItem` (built from `StatusBadge`), `VehicleSidebar` (built from `VehicleListItem`), `ConnectionBanner` (self-hiding status indicator). `FleetMap` is still one big component, but everything else is properly decomposed now.
- [x] State management with a defensible design — `selectedVehicleId` lives in `App.tsx` (the shared ancestor of sidebar + map) via plain `useState<string | null>`. Sidebar/list items are controlled components with no state of their own, just `selected`/`onSelect` props. `FleetMap` is now a third consumer of the same state (highlight + fly-to), which is the actual test of "lifted state over Context" holding up — still just prop drilling one level, no store needed. Connection status follows the same shape — owned by `useFleetSocket`, read by `ConnectionBanner` as a prop, no state duplication.
- [x] Token-based styling actually applied — sidebar UI (`VehicleSidebar`, `VehicleListItem`, `StatusBadge`) and `ConnectionBanner` are styled entirely from `theme/tokens.ts` (spacing, typography, color, radius). Still no chrome on the map canvas itself.
- [x] Performance under real-time updates — `setData` pattern holds up, and the fly-to effect deliberately depends on `[selectedVehicleId]` only (reading live vehicle data via a ref instead of a dependency) so selecting a vehicle doesn't re-fly the camera on every tick. Stress-tested by bumping the mock server from 10 to 250 vehicles (`FLEET_SIZE`, generated via `Array.from` instead of hand-listing names) — stayed smooth on both the map (WebGL circle rendering, cheap even at this scale) and the sidebar list (React re-rendering 250 simple `<li>`s once/sec is still inexpensive). Deliberately did **not** add `React.memo`/virtualization since nothing showed a need for it — worth noting the one real limitation found: every WebSocket message is `JSON.parse`'d into brand-new vehicle objects each tick, so naive `React.memo` (reference-equality props check) wouldn't help even for a vehicle that hasn't changed; a real fix would need a custom comparator or restructured state. Not yet tested past 250 — that's the ceiling this was validated at, not necessarily the app's actual limit.
- [x] Map marker interactivity — hover tooltip (`Popup`, shows name/status/speed, cursor changes to pointer) done via `mouseenter`/`mouseleave` layer-scoped events. Click-to-select done — clicking a marker calls the same `onSelectVehicle` callback the sidebar uses, so it drives the existing `selectedVehicleId` state (highlight + fly-to + sidebar sync) rather than introducing separate state. The richer "detail panel, pinned until dismissed" view was designed (reuse `selectedVehicleId`, render a `VehicleDetailPanel` bottom-right of the map) but deliberately not built yet — deferred, not abandoned.

## Proposed next slice

1. Decide on the data model additions above (which fields earn their place).
2. ~~Add a sidebar/list of vehicles next to the map~~ — done: `VehicleSidebar` renders live, clicking a row updates `selectedVehicleId` in `App.tsx` and highlights that row.
3. ~~Selection state: map side~~ — done: `FleetMap` receives `selectedVehicleId`, highlights the selected marker (bigger radius + stroke ring via MapLibre data-driven expressions) and flies the camera to it (`map.flyTo`, triggered only on selection change, not on every position tick).
4. ~~Add marker interactivity on the map itself: hover tooltip + click-to-open detail popup/panel~~ — hover tooltip and click-to-select both done. Detail panel (the "pinned until dismissed" half) is designed but not built — still open, see below.
5. ~~Apply theme tokens to the new UI chrome~~ — done for the sidebar and the new `ConnectionBanner` (added this slice: surfaces WebSocket `connecting`/`closed` state, hidden while `open`). Still applies to whatever chrome comes out of item 4.
6. Add one alert-worthy condition (e.g. idle-too-long) to exercise state + component composition together.
7. Build `VehicleDetailPanel` — bottom-right floating card, shown when `selectedVehicleId` is set, reusing `StatusBadge`; close button clears the selection. No new state needed, just a new consumer of `selectedVehicleId`.
8. Decide whether to keep `FLEET_SIZE = 250` (good for demonstrating scale) or dial it back down for a calmer demo (250 moving dots is a lot to look at) — currently still at 250 from the performance stress test.
