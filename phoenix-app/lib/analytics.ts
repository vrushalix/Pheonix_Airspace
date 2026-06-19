// ============================================================
// lib/analytics.ts
// Google Analytics 4 event tracking helpers
// All events respect GDPR consent before firing
// ============================================================

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    phoenixConsentGiven?: boolean;
  }
}

// ── Core gtag wrapper — checks consent first ──────────────
function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;
  // Only fire if user has given analytics consent (GDPR)
  if (!window.phoenixConsentGiven) return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, {
    ...params,
    send_to: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
  });
}

// ── Auth Events ───────────────────────────────────────────
export const analytics = {
  signUp: (method: "email" | "google") =>
    trackEvent("sign_up", { method }),

  login: (method: "email" | "google") =>
    trackEvent("login", { method }),

  logout: () =>
    trackEvent("logout"),

  // ── Feature Events ─────────────────────────────────────
  featureUsed: (featureName: string, details?: Record<string, unknown>) =>
    trackEvent("feature_used", { feature_name: featureName, ...details }),

  routeOptimized: (origin: string, destination: string) =>
    trackEvent("route_optimized", { origin, destination }),

  weatherLayerToggled: (layer: string, active: boolean) =>
    trackEvent("weather_layer_toggled", { layer, active }),

  // ── Conversion Events ───────────────────────────────────
  subscriptionStarted: (plan: string, price: number) =>
    trackEvent("subscription_started", { plan, value: price, currency: "EUR" }),

  paymentCompleted: (plan: string, amount: number) =>
    trackEvent("purchase", {
      transaction_id: crypto.randomUUID(),
      value: amount,
      currency: "EUR",
      items: [{ item_id: plan, item_name: `Phoenix ${plan}` }],
    }),

  trialStarted: () =>
    trackEvent("trial_started"),

  leadGenerated: (type: "contact" | "demo" | "newsletter") =>
    trackEvent("lead_generated", { lead_type: type }),

  // ── GDPR Consent ────────────────────────────────────────
  grantConsent: () => {
    if (typeof window === "undefined") return;
    window.phoenixConsentGiven = true;
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied", // We don't use ads
      });
    }
  },

  denyConsent: () => {
    if (typeof window === "undefined") return;
    window.phoenixConsentGiven = false;
  },
};
