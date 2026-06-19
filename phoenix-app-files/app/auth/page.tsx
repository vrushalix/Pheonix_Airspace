"use client";
// ============================================================
// app/auth/page.tsx
// Login & Registration — Phoenix Services
// ============================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  resetPassword,
} from "@/lib/auth";
import { analytics } from "@/lib/analytics";

type AuthMode = "login" | "register" | "reset";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function getFirebaseErrorMessage(code: string): string {
    const messages: Record<string, string> = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/popup-closed-by-user": "Sign-in popup was closed. Please try again.",
    };
    return messages[code] || "Something went wrong. Please try again.";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
        analytics.login("email");
        router.push("/dashboard");
      } else if (mode === "register") {
        await signUpWithEmail(email, password, displayName);
        analytics.signUp("email");
        router.push("/dashboard");
      } else if (mode === "reset") {
        await resetPassword(email);
        setSuccess("Password reset email sent. Check your inbox.");
      }
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      analytics.login("google");
      router.push("/dashboard");
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F9F6F0 0%, #F1EBE0 50%, #EBE4D6 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-inter), system-ui, sans-serif",
      padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "1.8rem",
            fontWeight: 700,
            color: "#1C1917",
            letterSpacing: "-0.03em",
          }}>
            Phoenix <span style={{ color: "#C29F5D" }}>Services</span>
          </div>
          <p style={{ color: "#57534E", fontSize: "0.88rem", marginTop: "4px" }}>
            Flight Path Intelligence Platform
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid rgba(194, 159, 93, 0.15)",
          borderRadius: "16px",
          padding: "36px 32px",
          boxShadow: "0 10px 40px rgba(28, 25, 23, 0.1)",
        }}>
          <h2 style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "24px",
            color: "#1C1917",
            textAlign: "center",
          }}>
            {mode === "login" && "Welcome back"}
            {mode === "register" && "Create your account"}
            {mode === "reset" && "Reset your password"}
          </h2>

          {/* Error / Success */}
          {error && (
            <div style={{
              background: "rgba(153, 27, 27, 0.06)",
              border: "1px solid rgba(153, 27, 27, 0.2)",
              color: "#991B1B",
              padding: "10px 14px",
              borderRadius: "6px",
              fontSize: "0.84rem",
              marginBottom: "16px",
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              background: "rgba(22, 101, 52, 0.06)",
              border: "1px solid rgba(22, 101, 52, 0.2)",
              color: "#166534",
              padding: "10px 14px",
              borderRadius: "6px",
              fontSize: "0.84rem",
              marginBottom: "16px",
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <input
                type="text"
                placeholder="Full name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                style={inputStyle}
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            {mode !== "reset" && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={inputStyle}
              />
            )}
            <button
              type="submit"
              disabled={loading}
              style={primaryButtonStyle}
            >
              {loading ? "Please wait..." : (
                mode === "login" ? "Sign in" :
                mode === "register" ? "Create account" :
                "Send reset link"
              )}
            </button>
          </form>

          {mode !== "reset" && (
            <>
              <div style={dividerStyle}>
                <span style={{ background: "#fff", padding: "0 12px" }}>or</span>
              </div>
              <button onClick={handleGoogle} disabled={loading} style={googleButtonStyle}>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}

          {/* Toggle links */}
          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.84rem", color: "#57534E" }}>
            {mode === "login" && (
              <>
                <button onClick={() => { setMode("reset"); setError(""); }} style={linkStyle}>
                  Forgot password?
                </button>
                {" · "}
                <button onClick={() => { setMode("register"); setError(""); }} style={linkStyle}>
                  Create account
                </button>
              </>
            )}
            {mode === "register" && (
              <button onClick={() => { setMode("login"); setError(""); }} style={linkStyle}>
                Already have an account? Sign in
              </button>
            )}
            {mode === "reset" && (
              <button onClick={() => { setMode("login"); setError(""); }} style={linkStyle}>
                Back to sign in
              </button>
            )}
          </div>
        </div>

        {/* Back to landing */}
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.8rem" }}>
          <a href="/" style={{ color: "#A8A29E", textDecoration: "none" }}>
            ← Back to homepage
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Inline styles ─────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid rgba(194, 159, 93, 0.2)",
  borderRadius: "8px",
  background: "#F9F6F0",
  color: "#1C1917",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  marginBottom: "12px",
  outline: "none",
  display: "block",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  border: "none",
  borderRadius: "8px",
  background: "#C29F5D",
  color: "white",
  fontSize: "0.9rem",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  marginTop: "4px",
};

const googleButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid rgba(194, 159, 93, 0.2)",
  borderRadius: "8px",
  background: "white",
  color: "#1C1917",
  fontSize: "0.9rem",
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
};

const dividerStyle: React.CSSProperties = {
  textAlign: "center",
  margin: "16px 0",
  color: "#A8A29E",
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  position: "relative",
  borderTop: "1px solid rgba(194, 159, 93, 0.15)",
};

const linkStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#C29F5D",
  cursor: "pointer",
  fontSize: "0.84rem",
  fontWeight: 600,
  padding: 0,
  fontFamily: "inherit",
};
