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
- [ ] Component architecture — currently just one component (`FleetMap`). Need reusable pieces: vehicle list/sidebar, detail panel, status badge, legend.
- [ ] State management with a defensible design — currently two `useState` calls in one hook. Need real state to manage: selected vehicle, filters, alert list.
- [ ] Token-based styling actually applied — `theme/tokens.ts` exists but is barely consumed (only status dot colors). No theming, no typography/spacing usage yet because there's no other UI chrome.
- [ ] Performance under real-time updates — `setData` pattern is good, but nothing stresses it yet (no memoization, no second live-updating surface like a list to show it staying smooth).
- [ ] Map marker interactivity — hover tooltip (quick glance: name/status/speed) and click-to-open detail (fuller info, pinned until dismissed). Two distinct interactions, neither built yet.

## Proposed next slice

1. Decide on the data model additions above (which fields earn their place).
2. Add a sidebar/list of vehicles next to the map — the thing most other checklist gaps hang off of.
3. Add selection state (click a vehicle in the list or on the map → highlight/focus both).
4. Add marker interactivity on the map itself: hover tooltip + click-to-open detail popup/panel.
5. Apply theme tokens to the new UI chrome.
6. Add one alert-worthy condition (e.g. idle-too-long) to exercise state + component composition together.
