"use client";
// ============================================================
// app/admin/page.tsx
// Admin Dashboard — Phoenix Services
// Presentation Version
// ============================================================

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

// Mock data for presentation purposes
const MOCK_STATS = {
  totalActiveUsers: 1245,
  newUsersThisWeek: 84,
  newUsersThisMonth: 312,
  subscriptionBreakdown: {
    free: 820,
    student_pro: 250,
    professional: 150,
    enterprise: 25,
  },
};

const MOCK_AUDIT_LOGS = [
  { id: "1", action: "change_plan", target: "user_7482", actor: "admin_1", time: "2 mins ago" },
  { id: "2", action: "suspend_user", target: "user_9921", actor: "admin_2", time: "1 hour ago" },
  { id: "3", action: "delete_data", target: "user_1022", actor: "system", time: "3 hours ago" },
  { id: "4", action: "change_plan", target: "user_5511", actor: "admin_1", time: "5 hours ago" },
];

const MOCK_USERS = [
  { id: "usr_001", email: "pilot.john@example.com", role: "public", plan: "student_pro", status: "active" },
  { id: "usr_002", email: "atc.sarah@airport.com", role: "employee", plan: "professional", status: "active" },
  { id: "usr_003", email: "fleet.mgr@airline.com", role: "public", plan: "enterprise", status: "active" },
  { id: "usr_004", email: "student.mike@flight.edu", role: "public", plan: "free", status: "suspended" },
];

export default function AdminDashboard() {
  const { role, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // In a real app, this would redirect non-admins. 
  // For presentation, we bypass it so you can view it.
  
  return (
    <div style={{
      minHeight: "100vh",
      background: "#F9F6F0", // Aviation Beige
      fontFamily: "var(--font-inter), system-ui, sans-serif",
      color: "#1C1917",
      display: "flex",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: "260px",
        background: "#FFFFFF",
        borderRight: "1px solid rgba(194, 159, 93, 0.2)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}>
            Phoenix <span style={{ color: "#C29F5D" }}>Admin</span>
          </h1>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <SidebarBtn active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>Overview</SidebarBtn>
          <SidebarBtn active={activeTab === "users"} onClick={() => setActiveTab("users")}>User Management</SidebarBtn>
          <SidebarBtn active={activeTab === "audit"} onClick={() => setActiveTab("audit")}>Audit Logs</SidebarBtn>
          <SidebarBtn active={activeTab === "billing"} onClick={() => setActiveTab("billing")}>Billing & Plans</SidebarBtn>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 600, fontFamily: "var(--font-outfit)" }}>
              {activeTab === "overview" && "Platform Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "audit" && "System Audit Logs"}
              {activeTab === "billing" && "Billing & Subscriptions"}
            </h2>
            <p style={{ color: "#57534E", marginTop: "4px" }}>Manage Phoenix Services infrastructure and users.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.85rem", color: "#A8A29E" }}>Environment: Production</span>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#C29F5D", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              A
            </div>
          </div>
        </header>

        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              <KPICard title="Total Active Users" value={MOCK_STATS.totalActiveUsers.toLocaleString()} trend="+12% this month" />
              <KPICard title="New Signups (7d)" value={MOCK_STATS.newUsersThisWeek.toString()} trend="+5% vs last week" />
              <KPICard title="MRR (Estimated)" value="$18,450" trend="+8% vs last month" />
            </div>

            {/* Subscriptions */}
            <div style={{ background: "#FFFFFF", padding: "24px", borderRadius: "12px", border: "1px solid rgba(194, 159, 93, 0.15)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "20px" }}>Subscription Distribution</h3>
              <div style={{ display: "flex", gap: "20px" }}>
                <PlanBar label="Free" count={MOCK_STATS.subscriptionBreakdown.free} total={MOCK_STATS.totalActiveUsers} color="#A8A29E" />
                <PlanBar label="Student Pro" count={MOCK_STATS.subscriptionBreakdown.student_pro} total={MOCK_STATS.totalActiveUsers} color="#C29F5D" />
                <PlanBar label="Professional" count={MOCK_STATS.subscriptionBreakdown.professional} total={MOCK_STATS.totalActiveUsers} color="#1E40AF" />
                <PlanBar label="Enterprise" count={MOCK_STATS.subscriptionBreakdown.enterprise} total={MOCK_STATS.totalActiveUsers} color="#1C1917" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid rgba(194, 159, 93, 0.15)", overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(194, 159, 93, 0.15)", display: "flex", justifyContent: "space-between" }}>
              <input type="text" placeholder="Search users by email or ID..." style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #E5E5E5", width: "300px" }} />
              <button style={{ background: "#C29F5D", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: 500, cursor: "pointer" }}>Invite User</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F9F6F0", color: "#57534E", fontSize: "0.85rem" }}>
                  <th style={{ padding: "12px 20px" }}>Email</th>
                  <th style={{ padding: "12px 20px" }}>Role</th>
                  <th style={{ padding: "12px 20px" }}>Plan</th>
                  <th style={{ padding: "12px 20px" }}>Status</th>
                  <th style={{ padding: "12px 20px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #F1EBE0" }}>
                    <td style={{ padding: "16px 20px", fontWeight: 500 }}>{u.email}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ background: u.role === "employee" ? "#E0E7FF" : "#F3F4F6", color: u.role === "employee" ? "#3730A3" : "#374151", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem", textTransform: "uppercase" }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", textTransform: "capitalize" }}>{u.plan.replace('_', ' ')}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ color: u.status === "active" ? "#166534" : "#991B1B", fontWeight: 500, fontSize: "0.85rem" }}>
                        ● {u.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <button style={{ background: "none", border: "none", color: "#C29F5D", cursor: "pointer", fontWeight: 500 }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "audit" && (
          <div style={{ background: "#FFFFFF", padding: "24px", borderRadius: "12px", border: "1px solid rgba(194, 159, 93, 0.15)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "20px" }}>Recent Admin Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {MOCK_AUDIT_LOGS.map(log => (
                <div key={log.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#F9F6F0", borderRadius: "8px" }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "#1C1917" }}>{log.actor}</span> performed <span style={{ fontFamily: "monospace", color: "#C29F5D" }}>{log.action}</span> on {log.target}
                  </div>
                  <div style={{ color: "#A8A29E", fontSize: "0.85rem" }}>{log.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "billing" && (
          <div style={{ background: "#FFFFFF", padding: "24px", borderRadius: "12px", border: "1px solid rgba(194, 159, 93, 0.15)" }}>
            <p style={{ color: "#57534E" }}>Stripe integration pending. Live revenue and invoice metrics will appear here.</p>
          </div>
        )}

      </main>
    </div>
  );
}

// ── Components ───────────────────────────────────────────

function SidebarBtn({ children, active, onClick }: { children: React.ReactNode, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left", padding: "10px 16px", borderRadius: "8px", border: "none",
      background: active ? "#F9F6F0" : "transparent",
      color: active ? "#C29F5D" : "#57534E",
      fontWeight: active ? 600 : 500,
      cursor: "pointer",
      transition: "all 0.2s",
    }}>
      {children}
    </button>
  );
}

function KPICard({ title, value, trend }: { title: string, value: string, trend: string }) {
  return (
    <div style={{ background: "#FFFFFF", padding: "24px", borderRadius: "12px", border: "1px solid rgba(194, 159, 93, 0.15)", boxShadow: "0 4px 20px rgba(28, 25, 23, 0.05)" }}>
      <h3 style={{ fontSize: "0.85rem", color: "#57534E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{title}</h3>
      <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-outfit)", color: "#1C1917", marginBottom: "4px" }}>{value}</div>
      <div style={{ fontSize: "0.8rem", color: "#166534" }}>↑ {trend}</div>
    </div>
  );
}

function PlanBar({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
  const percentage = Math.round((count / total) * 100);
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "8px", color: "#57534E" }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600 }}>{percentage}%</span>
      </div>
      <div style={{ height: "8px", background: "#F1EBE0", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ width: `${percentage}%`, height: "100%", background: color }} />
      </div>
      <div style={{ fontSize: "0.75rem", color: "#A8A29E", marginTop: "6px" }}>{count} users</div>
    </div>
  );
}
