"use client";
// ============================================================
// app/product/page.tsx
// Product Showcase Presentation — Phoenix Services
// ============================================================

import React from "react";
import Link from "next/link";

export default function ProductPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#F9F6F0",
      fontFamily: "var(--font-inter), system-ui, sans-serif",
      color: "#1C1917",
    }}>
      {/* Navigation Bar */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 60px",
        background: "rgba(249, 246, 240, 0.9)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(194, 159, 93, 0.15)",
      }}>
        <div style={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}>
          <Link href="/" style={{ textDecoration: "none", color: "#1C1917" }}>
            Phoenix<span style={{ color: "#C29F5D" }}>Services</span>
          </Link>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/auth" style={{
            padding: "10px 20px",
            border: "1px solid rgba(194, 159, 93, 0.3)",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#1C1917",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}>Login</Link>
          <Link href="/auth" style={{
            padding: "10px 24px",
            background: "#C29F5D",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.85rem",
            textDecoration: "none",
          }}>Get Started</Link>
        </div>
      </nav>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px" }}>
        
        {/* Hero Section */}
        <section style={{ textAlign: "center", marginBottom: "80px" }}>
          <h1 style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "4rem",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            marginBottom: "24px",
            lineHeight: 1.1,
          }}>
            Master the Elements.<br />
            <span style={{ color: "#C29F5D" }}>Optimize the Flight.</span>
          </h1>
          <p style={{
            fontSize: "1.25rem",
            color: "#57534E",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            Phoenix Services is an advanced, weather-aware flight path intelligence platform. 
            We integrate real-time atmospheric data, wind vectors, and AI-driven analysis to calculate the safest, most fuel-efficient routes in the sky.
          </p>
        </section>

        {/* Benefits Grid */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "2.5rem",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "40px",
            letterSpacing: "-0.02em",
          }}>Who it's for</h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
          }}>
            {/* Pilots */}
            <div style={cardStyle}>
              <div style={iconBoxStyle}>👨‍✈️</div>
              <h3 style={cardTitleStyle}>For Commercial Pilots</h3>
              <p style={cardTextStyle}>
                Say goodbye to turbulence surprises. Phoenix provides pilots with real-time visualization of severe weather codes and wind gusts along their direct route. Make informed decisions to deviate smoothly, ensuring maximum passenger comfort and structural safety.
              </p>
            </div>

            {/* ATCs */}
            <div style={cardStyle}>
              <div style={iconBoxStyle}>📡</div>
              <h3 style={cardTitleStyle}>For Air Traffic Controllers</h3>
              <p style={cardTextStyle}>
                Anticipate the flow. By seeing exactly where weather cells will push incoming traffic, ATCs can proactively manage sector capacities and suggest optimized holding patterns or alternate routings before airspace becomes congested.
              </p>
            </div>

            {/* Pilot Schools */}
            <div style={cardStyle}>
              <div style={iconBoxStyle}>🎓</div>
              <h3 style={cardTitleStyle}>For Pilot Schools</h3>
              <p style={cardTextStyle}>
                The ultimate meteorological teaching tool. Instructors can use Phoenix to visually demonstrate how wind vectors affect fuel burn and flight times, training the next generation of aviators to plan routes that are not just direct, but intelligent.
              </p>
            </div>
          </div>
        </section>

        {/* Final Impact Section */}
        <section style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "60px",
          border: "1px solid rgba(194, 159, 93, 0.2)",
          boxShadow: "0 10px 40px rgba(28, 25, 23, 0.05)",
          display: "flex",
          alignItems: "center",
          gap: "40px",
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}>The Final Impact</h2>
            <p style={{ fontSize: "1.1rem", color: "#57534E", lineHeight: 1.6, marginBottom: "24px" }}>
              Aviation currently accounts for roughly 2.5% of global CO₂ emissions. By intelligently routing aircraft to ride tailwinds and avoid harsh headwinds, Phoenix Services enables a massive reduction in global fuel consumption.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              <li style={listItemStyle}>
                <span style={checkStyle}>✓</span>
                <div>
                  <strong>Sustainability:</strong> Saves an estimated 5-8% in fuel burn per optimized long-haul flight, directly cutting thousands of tons of CO₂.
                </div>
              </li>
              <li style={listItemStyle}>
                <span style={checkStyle}>✓</span>
                <div>
                  <strong>Economic Efficiency:</strong> Reduces operating costs for airlines and fleet operators by thousands of dollars per route.
                </div>
              </li>
              <li style={listItemStyle}>
                <span style={checkStyle}>✓</span>
                <div>
                  <strong>Uncompromised Safety:</strong> Eliminates the guesswork of navigating through severe storm cells and extreme weather phenomena.
                </div>
              </li>
            </ul>
          </div>
          <div style={{
            flex: 1,
            background: "#1C1917",
            borderRadius: "16px",
            padding: "40px",
            color: "#F9F6F0",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "3rem", fontWeight: 700, color: "#C29F5D", marginBottom: "8px", fontFamily: "var(--font-outfit)" }}>8%</div>
            <div style={{ fontSize: "1.1rem", marginBottom: "32px", color: "#A8A29E" }}>Average Fuel Savings</div>
            
            <div style={{ fontSize: "3rem", fontWeight: 700, color: "#C29F5D", marginBottom: "8px", fontFamily: "var(--font-outfit)" }}>100%</div>
            <div style={{ fontSize: "1.1rem", color: "#A8A29E" }}>Weather Awareness</div>
          </div>
        </section>

      </main>
    </div>
  );
}

// ── Inline Styles ─────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  padding: "40px 32px",
  borderRadius: "16px",
  border: "1px solid rgba(194, 159, 93, 0.15)",
  boxShadow: "0 4px 20px rgba(28, 25, 23, 0.04)",
  transition: "transform 0.3s ease",
};

const iconBoxStyle: React.CSSProperties = {
  width: "56px",
  height: "56px",
  background: "rgba(194, 159, 93, 0.1)",
  border: "1px solid rgba(194, 159, 93, 0.2)",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.8rem",
  marginBottom: "24px",
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontSize: "1.3rem",
  fontWeight: 600,
  marginBottom: "16px",
  color: "#1C1917",
};

const cardTextStyle: React.CSSProperties = {
  color: "#57534E",
  lineHeight: 1.6,
  fontSize: "0.95rem",
};

const listItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  color: "#1C1917",
  lineHeight: 1.5,
};

const checkStyle: React.CSSProperties = {
  color: "#C29F5D",
  fontWeight: "bold",
  fontSize: "1.2rem",
};
