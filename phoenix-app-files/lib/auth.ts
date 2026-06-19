// ============================================================
// lib/auth.ts
// Auth helpers, role checking, and session management
// ============================================================

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export type UserRole = "public" | "employee" | "admin";

export interface PhoenixUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  subscriptionTier: "free" | "student_pro" | "professional" | "enterprise";
  status: "active" | "suspended" | "deleted";
}

// ── Get role from Firebase ID token claims ─────────────────
export async function getUserRole(user: User): Promise<UserRole> {
  const idTokenResult = await user.getIdTokenResult(true); // force refresh
  return (idTokenResult.claims.role as UserRole) || "public";
}

// ── Get full user profile from Firestore ──────────────────
export async function getUserProfile(uid: string): Promise<PhoenixUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as PhoenixUser;
}

// ── Sign up with Email/Password ───────────────────────────
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  // User document created by Cloud Function onUserCreate
  // But we set displayName here for immediate UX
  await setDoc(
    doc(db, "users", cred.user.uid),
    {
      displayName,
      email,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  return cred.user;
}

// ── Sign in with Email/Password ───────────────────────────
export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// ── Sign in with Google ───────────────────────────────────
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

// ── Sign out ──────────────────────────────────────────────
export async function logOut() {
  await signOut(auth);
}

// ── Password reset ────────────────────────────────────────
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// ── Auth state listener ───────────────────────────────────
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ── Role permission checks ────────────────────────────────
export const permissions = {
  canAccessAdmin: (role: UserRole) => role === "admin",
  canAccessEmployee: (role: UserRole) =>
    role === "admin" || role === "employee",
  canManageUsers: (role: UserRole) => role === "admin",
  canViewAnalytics: (role: UserRole) =>
    role === "admin" || role === "employee",
};
