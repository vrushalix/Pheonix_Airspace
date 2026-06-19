# Phoenix Services — Development Log

## Project Overview
**Goal**: Build a weather visualization & flight path optimization platform for aviation professionals (ATC, airlines, cargo, military, pilot schools, private jets).

**Core Value Proposition**: Efficient flight routing using real-time weather data, wind patterns, and local AI computation (Ollama) for fuel savings.

**Current Version**: Iteration 1 (Frontend complete) → Phase 2 (Backend Sprint initiated)

---

## Phase 2: Backend Architecture Sprint
**Status**: 📋 Implementation Plan Created — Awaiting Firebase/Stripe credentials from user
**Started**: 2026-06-19

### Sprint Overview (Mon–Thu Structure)
| Day | Focus | Status |
|-----|-------|--------|
| Monday | RBAC + Admin Dashboard | ⏳ Pending credentials |
| Tuesday | GA4 Analytics + Firebase Telemetry | ⏳ Pending |
| Wednesday | CRM (HubSpot) + Lead Generation | ⏳ Pending |
| Thursday | Stripe Payments + GDPR/Legal | ⏳ Pending |

### Decisions Made
- **Auth**: Firebase Auth — Email/Password + Google Sign-In (Apple deferred)
- **RBAC**: 3-tier role system via Firebase Custom Claims: `public`, `employee`, `admin`
- **Database**: Firestore — collections for users, audit_logs, telemetry, leads, subscriptions, invoices, consent_records
- **Payments**: Stripe (Checkout Sessions + Webhooks + Customer Portal)
- **CRM**: HubSpot Free tier — best startup option (unlimited contacts, email automation, full API)
- **Analytics**: GA4 with custom event tracking + Firebase telemetry layer
- **Legal**: GDPR-compliant (cookie consent, data export, account deletion)
- **Hosting**: Firebase Hosting
- **Cost**: ~$0/month for first 10,000 users on Firebase Spark plan

### Blocking Requirements (From User)
- [ ] Firebase project ID or creation confirmation
- [ ] Stripe account + test API keys
- [ ] App domain/URL (for auth redirects)
- [ ] Frontend framework decision: Single HTML file vs Next.js migration
- [ ] Subscription pricing & feature limits per tier
- [ ] EU user targeting confirmation (GDPR strictness level)

### Entry 1 — 2026-06-19 04:55 IST
- Read and analyzed `backend_architecture_prompt.txt` (329 lines, 5-day sprint plan)
- Created full implementation plan with Firestore schemas, architecture diagrams, cost estimates
- Identified 6 blocking questions that require user input before code generation
- Recommended HubSpot Free as CRM (vs Zoho/Pipedrive evaluation)
- Estimated $0/month Firebase cost through first 10,000 users

---

## Phase 1A: Foundation — Map + Weather Layers + Auth Shell
**Status**: 🔄 In Progress  
**Started**: 2026-04-10

### Decisions Made
- **Architecture**: Single-file HTML app (portable, no build step)
- **Map Engine**: Leaflet.js via CDN — reliable, well-tested, great plugin ecosystem
- **Weather API**: Open-Meteo (free, no API key, hourly forecasts)
- **Color Palette**: Beige/cream (NetJets-inspired) with dark map base (CartoDB Dark Matter)
- **Auth**: Firebase (Google + Email/Password). Apple sign-in deferred to later.
- **Flight Data**: Simulated realistic routes for now. AirLabs integration planned for later.
- **AI Engine**: Ollama running locally for flight path optimization computation
- **Target Users**: ATC, private airliners, luxury airliners, cargo airlines, commercial airlines, military, pilots with private jets, pilot schools

### Weather Layers Implemented
| Layer | Data Source | Visualization |
|-------|-----------|---------------|
| Wind | Open-Meteo `wind_speed_10m` + `wind_direction_10m` | Animated canvas particles |
| Clouds | Open-Meteo `cloud_cover` | Opacity overlay |
| Temperature | Open-Meteo `temperature_2m` | Color-coded heatmap |
| Rain | Open-Meteo `rain` | Blue intensity overlay |
| Thunderstorms | Open-Meteo `weather_code` | Storm markers |
| Snow | Open-Meteo `snowfall` | White particle overlay |
| Fog/Visibility | Open-Meteo `visibility` | Fog density overlay (unique feature) |

### Build Log

#### Entry 1 — 2026-04-10 17:24 IST
- Completed research phase: analyzed Windy.com, NetJets, AirLabs, Wind_patterns reference
- Verified Open-Meteo API works with all needed parameters
- Created implementation plan — approved by user
- User added 2nd iteration requirements: takeoff/landing input, fuel efficiency tab, AI training data tab
- User clarified target audience: aviation professionals across all segments
- Starting build of index.html

---

## Phase 1B: Flight Route Planning Tab (Planned)
**Status**: ⏳ Queued

- User inputs takeoff and landing locations
- App generates flight path considering weather data
- Shows weather conditions along the route
- Integrates with AI for route optimization

## Phase 1C: Fuel Efficiency Analysis Tab (Planned)
**Status**: ⏳ Queued

- Fuel efficiency calculations based on weather filters
- Enhanced vs standard route comparison
- Savings estimates

## Phase 1D: AI Model Training Tab (Planned)
**Status**: ⏳ Queued

- Ollama integration for local AI computation
- Training data visualization
- Model performance metrics

---

## Bugs & Issues Log
| # | Issue | Status | Fix |
|---|-------|--------|-----|
| 1 | Firebase Auth fails via `file://` protocol | ✅ Fixed | Added "Guest Mode" fallback logic and UI button |
| 2 | Route Search requires dropdown selection | ✅ Fixed | Improved input robustness with auto-search fallback |
| 3 | Wind particles invisible/not animating | ✅ Fixed | Rebuilt canvas engine with Windy.com style streamlines |
| 4 | Temp/Rain map overlays not showing globally | ✅ Fixed | Optimized Open-Meteo batch fetching (1 -> 80 pts/req) |
| 5 | Map click not opening weather panel | ✅ Fixed | Bound `switchTab` UI trigger to map click |
| 6 | Custom route inputs not found | ✅ Fixed | Integrated Open-Meteo Geocoding for custom queries |
| 7 | Wind vectors broken / map darkens on wind layer | 🔄 Known | WebGL GPU acceleration issue — fix planned in Phase 2 |
| 8 | Route compute fails for non-preset locations | 🔄 Known | Geocoding fallback needed — in Phase 1B queue |
| 9 | Weather layer buttons show no temp/data on click | 🔄 Known | Data source migration to Copernicus/Sentinel planned |
