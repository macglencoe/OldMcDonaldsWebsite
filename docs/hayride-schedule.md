# Hayride Schedule Branch Documentation

## Purpose
This branch turns the Old McDonald's farm admin site into a hayride operations console. It lets the admissions booth keep wagon rosters accurate in real time and gives drivers a live view of what wagons should run each half-hour slot, how full they are, and which wagons are unscheduled. The focus of this documentation is everything that drives that experience: the database schema, API surface, data-loading and mutation flows, and the React components that render and edit the schedule.

> **Scope note:** Non-hayride content that still lives in the repository (legacy marketing pages, contact forms, etc.) is out of scope and intentionally omitted here.

## High-Level Architecture

    Browser (View or Edit mode)
        +-- HayrideScheduleView (client component)
            +-- fetches /api/hayrides?date=YYYY-MM-DD on load and poll
            +-- renders Timeline
                +-- HayrideCard
                    +-- Fillbar (mutates via POST /api/hayrides)

    Next.js API Route: app/api/hayrides/route.js
        +-- GET: read schedule for a day, merge with slot plus wagon templates
        +-- POST: upsert slot and wagon rows, optimistic concurrency on wagon version

    Persistence: PostgreSQL (Neon) via Drizzle ORM
        +-- hayride_slots table - one row per date plus start time
        +-- hayride_wagons table - wagon roster entries linked to slots

    Domain helpers
        +-- lib/slots.js - weekday templates -> ISO timestamps and labels
        +-- lib/wagons.js - canonical wagon definitions and lookup helpers

A single schedule date is the organizing key. Both read and write code resolve (or derive) that date and then operate on the union of actual data plus templated expectations for that date's day-of-week.

## Data Model

### Tables (`lib/db/schema.ts`)

- `hayride_slots`  
  - `date` (`YYYY-MM-DD`) and `start` (ISO timestamp) uniquely identify a slot.  
  - `label` is optional (usually auto-generated from start).  
  - `created_at` is server-generated for audit context.

- `hayride_wagons`  
  - `slot_id` foreign key to `hayride_slots`.  
  - `wagon_id` ties back to roster definitions such as `wagon-green`.  
  - `color`, `capacity`, `filled`, `version`, `notes` capture operational state. Only `filled` and `version` are actively mutated today; others default from roster definitions but stay overridable in the table so odd wagons can be tracked.  
  - Unique index on (`slot_id`, `wagon_id`) enforces one row per wagon per slot.

Drizzle migrations in `drizzle/` create both tables and their uniqueness constraints. The branch ships with two migrations (`0000_*` for table creation and `0001_*` for indexes). Use the provided `npm run db:migrate` to push schema changes.

### Roster Definitions (`lib/wagons.js`)

`HAYRIDE_WAGONS` defines the default set of wagons exposed to drivers and editors. Each entry contains `id`, `color`, `capacity`, and a user-facing `label`. The helper `getWagonDefaults(wagonId)` returns that definition or falls back to a neutral placeholder (`capacity 0`) when the server encounters a wagon it does not recognize. This allows temporary wagons to participate without breaking rendering.

`HAYRIDE_WAGON_LOOKUP` is a precomputed `{ [id]: wagon }` map used wherever the code needs constant-time access to roster metadata (server and client).

### Slot Templates (`lib/slots.js`)

`getSlotsForDate(dateISO)` maps the provided date to its weekday and expands a hard-coded schedule of half-hour times for Friday, Saturday, Sunday, and Monday. The return value is an ordered list of `{ start, label }` objects where `start` is an ISO string anchored to the requested date and `label` is a pre-formatted human-readable time. If a day has no template (Tuesday-Thursday), an empty list is returned, so only explicitly created slots will render.

These templates drive two behaviors:  
1. The API merges real data onto the template to produce expected slots even when the database is empty.  
2. The client merges templates with fetched data to guarantee consistent ordering and to ensure new wagons inherit sensible defaults before their first update reaches the server.

## Backend and API Layer (`app/api/hayrides/route.js`)

### GET `/api/hayrides`

- Query parameters: `date=YYYY-MM-DD` (optional). Invalid or missing values default to `todayISO()` (localised to America/Chicago).  
- Process:  
  1. Load `slot` rows for the given date ordered by start.  
  2. Load `wagon` rows for those slot IDs.  
  3. Normalize wagon rows `(normalizeWagonRow)` to clamp capacities or filled counts, fall back to roster defaults, and expose a version number used for optimistic locking.  
  4. Merge actual slots with the template returned by `getSlotsForDate`. Any slot missing in the template (for example ad-hoc times) is appended and sorted chronologically, so drivers always see combined canonical and ad-hoc entries.  
  5. Attach metadata: schedule date, timezone, response timestamps, and filter meta.  
  6. Generate an ETag (weak) from the payload to support conditional GETs and set Cache-Control: no-store to keep everything fresh.

- Response structure:

        {
          status: ok,
          data: {
            date: 2025-03-28,
            timezone: America/Chicago,
            lastUpdated: 2025-03-28T16:05:30.000Z,
            slots: [ { start: ..., label: ..., wagons: [...] }, ... ]
          },
          meta: {
            fetchedAt: 2025-03-28T16:05:30.000Z,
            filters: { date: 2025-03-28 }
          }
        }

  Errors are logged to the server console and returned as { status: error, message } with appropriate HTTP status codes.

### POST /api/hayrides

- Body fields (JSON):  
  - wagonId (required) - roster or bespoke wagon identifier.  
  - slotStart (required) - ISO timestamp at :00 or :30 minutes.  
  - date (optional) - overrides the inferred schedule date (defaults to the date portion of slotStart).  
  - delta (optional) - integer change applied to filled (positive or negative).  
  - setFilled (optional, alternative to delta) - force the filled count to an explicit value.  
  - expectedVersion (optional) - the caller's view of the wagon row version for optimistic concurrency. Defaults to the persisted version when omitted.  
  - slotLabel (optional) - custom label stored on slot creation.

- Process:  
  1. Validate inputs (isValidIso, isValidDate).  
  2. Resolve the schedule date (either request-provided date or derived from slotStart).  
  3. Upsert the slot via findOrCreateSlot, which first tries an insert and falls back to a select if a conflict occurs.  
  4. Upsert the wagon via findOrCreateWagon, defaulting color and capacity from roster definitions.  
  5. Compare expectedVersion to the current row version. If they differ, respond 409 Conflict so the client can re-fetch sync state.  
  6. Compute the next filled value with computeNextFilled, clamping to 0 and capacity.  
  7. If the value is unchanged, respond success without writing (saves database churn).  
  8. Otherwise, update the row setting filled and incrementing version. The WHERE clause repeats the original version to guard against concurrent writes; if no row is returned, another writer snuck in, so respond 409.  
  9. Return the normalized wagon row plus metadata.

- Concurrency contract:  
  - Each row has a version integer. Client sends expectedVersion, server increments on success. Conflicts are communicated with HTTP 409 and an explanatory message.  
  - Both client and server clamp counts, so negative deltas or overfills simply snap to the legal range.

## Frontend Structure

### Pages

- app/page.js - Driver-facing read-only view. Fetches the initial payload server-side (using incoming request headers to build an absolute URL), passes it into HayrideScheduleView, and lets the client poll every 30 seconds.  
- app/edit/page.js - Admissions booth editing surface. Same fetch path, but toggles isEditable so the client enables mutation controls and tightens the poll interval to 2 seconds.

### Shared Layout (app/layout.js)

Renders Navbar for quick switching between View and Edit, injects fonts, and wraps the page content in a centered container. Metadata titles are tuned to the hayride context.

### HayrideScheduleView (components/hayrideScheduleView.js)

Responsibilities:  
- Own the selected date (defaults to API-provided date or today's date) and expose an input type=date control for quick switching.  
- Fetch the schedule for that date on mount, when the date changes, when the user clicks Refresh, and on an interval determined by isEditable.  
- Merge fetched data with slot templates (getSlotsForDate) so the UI stays stable even before database records exist, and re-merge on every local optimistic update.  
- When running in edit mode, patch in-place filled counts and version numbers using handleWagonFilledChange after a successful mutation response to avoid a full re-fetch.  
- Render the Timeline plus contextual metadata (FetchedStatus summarises last fetch and last update timestamps).

State shape mirrors the API response (data, meta, and error), making it easy to swap out for mocked data in tests or fall back to server-provided payloads.

### Timeline (components/timeline.js)

- Sorts slots chronologically and builds anchor IDs for jump navigation.  
- Maintains intersection-observer-driven highlighting so the navigation list tracks which time bucket is on screen.  
- Offers a Now button that scrolls to the slot whose start time is closest to the current clock (anchored to the selected date when available).  
- Delegates each wagon rendering to HayrideCard, injecting the onWagonFilledChange callback when editing is enabled.

### HayrideCard (components/hayrideCard.js)

- Formats the card heading color using Tailwind utility classes mapped in TEXT_COLOR_CLASSES.  
- Normalizes incoming props (filled, fill, version) to positive numbers and stores them in local state for instant visual feedback.  
- Emits changes to Fillbar, wrapping the callback so the parent receives the updated fill count, version, and contextual metadata (slotStart, wagonId, date).

### Fillbar (components/fillbar.js)

- Renders a segmented bar representing wagon capacity. Segments are interactive when isEditable is true: clicking the last filled segment subtracts one rider, clicking the next empty segment adds one.  
- Prevents overflows or underflows client-side and can gracefully operate in local only mode when wagonId is missing.  
- On each change, calls /api/hayrides with delta and expectedVersion. Shows inline status feedback (saving spinner, success checkmark, or error triangle) and updates its local version counter when the server responds.  
- Relays the normalized data back up via onChange, enabling HayrideScheduleView to optimistically reconcile without waiting for the next poll.

### Supporting Components

- FetchedStatus - keeps a live Fetched X seconds ago message on screen, refreshing every second.  
- Navbar - simple site chrome with View and Edit links. Uses usePathname to highlight the active route and collapses into a hamburger menu on narrow screens.  
- Error boundaries (app/error.js, app/global-error.js, components/error/errorPage.js) render branded fallback UIs and expose reset buttons. They do not alter hayride logic but are useful when diagnosing runtime failures.

## Data Flow Summary

1. Driver opens the schedule (route /): server-side render fetches the current day via GET /api/hayrides. Client hydrates, starts a 30-second poll loop, and any edits made elsewhere will appear on the next fetch.  
2. Admissions edits (route /edit): same initial fetch, but the UI renders interactive Fillbar controls. When staff adjust counts, the client sends POST /api/hayrides with the wagon ID, slot start, and signed delta. On success the UI updates immediately and, if polls are still running, the next poll will already see the new filled count and version.  
3. Concurrency: if another clerk modified the same wagon-slot between fetch and update, the POST responds 409 and the Fillbar shows the error message. The operator simply clicks Refresh (or waits for the 2-second poll) to sync and retry.

## Environment and Configuration

- Database: expects a Postgres database accessible via DATABASE_URL (Neon serverless by default). For local migrations with Drizzle Studio, optionally provide DIRECT_DATABASE_URL.  
- Preview protection: setting ENABLE_PREVIEW_PROTECTION=1 activates HTTP Basic Auth via middleware.ts. Credentials come from PREVIEW_USER and PREVIEW_PASS. This is helpful when staging the schedule pre-season.  
- Time zone: All server responses tag timezone: America/Chicago. Slot ISO strings are stored without offsets (local midnight anchoring); clients use local time when formatting but default to the labelled strings.

## Developer Tooling

- npm run dev - run Next.js locally.  
- npm run db:generate - generate Drizzle SQL migrations from schema changes.  
- npm run db:migrate - push migrations to the configured database.  
- npm run db:studio - inspect data via Drizzle Studio (handy for verifying slots and wagons during testing).

A seeded dataset example lives at data/hayrides.example.json to help visualize expected payloads when stubbing network calls.

## Extensibility Notes

- Adding new wagons: extend HAYRIDE_WAGONS; both server and client pick up the change immediately because everything merges against that roster. Existing rows in hayride_wagons keep their stored values, so ensure capacity stays in sync by updating database records if needed.  
- Adjusting operating hours: edit the weekday arrays in lib/slots.js. Remember to keep times sorted chronologically; both server and client sort by Date(start) so canonical ordering depends on valid timestamps.  
- Additional wagon metadata: the schema already includes a notes column. To surface it, expand the API serializers and UI components - the optimistic update plumbing is already set up to pass extra fields through.  
- Bulk imports: build against the POST route for fine-grained edits or create a new API handler that writes multiple wagons in one transaction. Reuse findOrCreateSlot and findOrCreateWagon to guarantee idempotency.

## Operational Checklist

1. Configure DATABASE_URL and run npm run db:migrate to ensure the hayride tables exist.  
2. Optionally set ENABLE_PREVIEW_PROTECTION=1 with credentials before exposing the edit UI outside the network.  
3. Deploy - both / and /edit routes share the same code, so no additional configuration is required for the driver kiosk versus admissions device.  
4. During operations, monitor server logs for [POST /api/hayrides] errors. Frequent version mismatches may indicate devices running offline or long-lived tabs that need manual refreshes.

## Mermaid Diagrams

The following Mermaid sources live in docs/diagrams:

- Overall architecture: docs/diagrams/hayride-overview.mmd
- GET request flow: docs/diagrams/api-get-flow.mmd
- POST mutation flow: docs/diagrams/api-post-flow.mmd
- Frontend component tree: docs/diagrams/frontend-components.mmd
- Server merge pipeline: docs/diagrams/server-merge-slots.mmd

Render with: npx @mermaid-js/mermaid-cli -i <file> -o <output> or any Markdown preview that supports Mermaid fences.
