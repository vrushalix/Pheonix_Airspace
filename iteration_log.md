# Phoenix Services — Iteration Log

## Iteration 1 — 2026-06-10
### Aesthetic, Navigation & Theme Overhaul
- **Premium Landing Page**: Implemented a high-fidelity landing page modeled after `factory.ai`, featuring a structural header (Product, Enterprise, Pricing, Login, Docs).
- **Refined Navigation Flow**: The application now prioritizes a professional landing experience. Accessing the "Product" (Map) now triggers an authentication layer, ensuring a secure and structured user journey.
- **Bespoke Design System**: 
    - **Palette**: Shifted to an "Aviation Beige" (`#F9F6F0`) base with "Brushed Gold" (`#C29F5D`) accents and "Charcoal" (`#1C1917`) typography.
    - **Typography**: Integrated `Outfit` for display headings and `Inter` for UI clarity.
- **"Un-AI" Iconography**: Completely removed all emojis from the interface. Replaced with minimalist, thin-stroke Inline SVGs for the navigation rail, layer toggles, and badges.
- **Light Map Experience**: Integrated CartoDB Positron as the primary tile layer, providing a crisp, high-end light map that improves readability for aviation overlays.
- **Glassmorphism & Shadows**: Updated UI panels with tinted glass effects and soft elevation shadows to eliminate the "AI-generated" appearance.

---

## Iteration 2 — 2026-06-19
### Backend Architecture Sprint — Planning & Design Phase

**Scope**: Initiating full SaaS backend implementation based on `backend_architecture_prompt.txt`.

#### Architecture Decisions Locked
- **Identity & Auth**: Firebase Auth with Custom Claims for role-based access (3 tiers: `public`, `employee`, `admin`)
- **Database**: Firestore with structured collections — users, audit_logs, telemetry, sessions, leads, subscriptions, invoices, consent_records, data_requests
- **Payments**: Stripe — Checkout Sessions + Customer Portal + Webhook-driven subscription sync
- **Analytics**: Google Analytics 4 (event tracking) + Firebase custom telemetry (retention, UTM, device data)
- **CRM**: HubSpot Free — selected over Zoho/Pipedrive for best free tier and API access
- **Legal/Compliance**: GDPR-ready — cookie consent banner, data export, account deletion flows
- **Hosting**: Firebase Hosting (static delivery, CDN-backed)
- **Cost Target**: $0/month through first 10,000 users (Firebase Spark plan)

#### Sprint Structure (Mon–Thu)
| Day | Area | Key Deliverables |
|-----|------|-----------------|
| Monday | RBAC + Admin | Custom claims, Firestore rules, Admin Dashboard UI |
| Tuesday | Analytics | GA4 events, telemetry Cloud Functions, session tracking |
| Wednesday | GTM Systems | HubSpot CRM sync, lead capture, traction dashboard |
| Thursday | Payments + Legal | Stripe integration, GDPR flows, privacy/ToS pages |

#### Status
- Implementation plan created and awaiting user input on 6 blocking credentials/decisions.
- No code written yet — blocked on Firebase project ID, Stripe keys, pricing, domain, and framework choice.
