"use client";
// ============================================================
// components/CookieConsentBanner.tsx
// GDPR EU-strict cookie consent banner
// No analytics fire until user explicitly accepts
// ============================================================

import { useEffect, useState } from "react";
import { analytics } from "@/lib/analytics";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";

const CONSENT_KEY = "phoenix_gdpr_consent";

export default function CookieConsentBanner() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
    else if (stored === "granted") analytics.grantConsent();
  }, []);

  async function saveConsentToFirestore(granted: boolean) {
    if (!user) return;
    await setDoc(
      doc(db, "consent_records", user.uid),
      {
        analyticsConsent: granted,
        marketingConsent: granted,
        functionalConsent: true, // always required
        consentTimestamp: serverTimestamp(),
        consentVersion: "1.0",
      },
      { merge: true }
    );
  }

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "granted");
    analytics.grantConsent();
    saveConsentToFirestore(true);
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, "denied");
    analytics.denyConsent();
    saveConsentToFirestore(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 99999,
      background: "#FFFFFF",
      borderTop: "1px solid rgba(194, 159, 93, 0.2)",
      boxShadow: "0 -4px 32px rgba(28, 25, 23, 0.1)",
      padding: "20px 32px",
      display: "flex",
      alignItems: "flex-start",
      gap: "24px",
      flexWrap: "wrap",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ flex: 1, minWidth: "280px" }}>
        <p style={{
          fontSize: "0.88rem",
          color: "#1C1917",
          lineHeight: 1.6,
          margin: 0,
        }}>
          🍪 We use cookies to improve your experience and measure platform
          performance. As an EU user, you have full control over your data under
          GDPR. Functional cookies are required for the platform to work.{" "}
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              color: "#C29F5D",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.88rem",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            {showDetails ? "Hide details" : "Learn more"}
          </button>
        </p>
        {showDetails && (
          <div style={{
            marginTop: "12px",
            padding: "12px",
            background: "#F9F6F0",
            borderRadius: "8px",
            fontSize: "0.8rem",
            color: "#57534E",
          }}>
            <p><strong>Functional (required):</strong> Login state, session management. Cannot be disabled.</p>
            <p style={{ marginTop: "6px" }}><strong>Analytics (optional):</strong> Anonymous usage data via Google Analytics 4 to help us improve the platform.</p>
            <p style={{ marginTop: "6px" }}><strong>Marketing (optional):</strong> Understanding how you found us. No advertising or third-party tracking.</p>
            <p style={{ marginTop: "8px" }}>
              You can change your consent at any time in{" "}
              <a href="/dashboard/settings" style={{ color: "#C29F5D" }}>Account Settings</a>.
            </p>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0 }}>
        <button
          onClick={handleDecline}
          style={{
            padding: "10px 20px",
            border: "1px solid rgba(194, 159, 93, 0.3)",
            borderRadius: "8px",
            background: "transparent",
            color: "#57534E",
            fontSize: "0.88rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Decline optional
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: "10px 24px",
            border: "none",
            borderRadius: "8px",
            background: "#C29F5D",
            color: "white",
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
