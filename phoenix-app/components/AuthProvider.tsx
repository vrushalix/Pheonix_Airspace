"use client";
// ============================================================
// components/AuthProvider.tsx
// Global auth context — wraps entire app
// ============================================================

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthChange, getUserRole, UserRole } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let mounted = true;
    (async () => {
      try {
        const authLib = await import("@/lib/auth");
        unsub = authLib.onAuthChange(async (firebaseUser: User | null) => {
          if (!mounted) return;
          setUser(firebaseUser);
          if (firebaseUser) {
            try {
              const userRole = await authLib.getUserRole(firebaseUser);
              setRole(userRole);
            } catch (e) {
              setRole("public");
            }
          } else {
            setRole(null);
          }
          setLoading(false);
        });
      } catch (err) {
        // Firebase not configured or fails to initialize — fallback to demo mode
        setUser(null);
        setRole("admin");
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
      if (unsub) unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
