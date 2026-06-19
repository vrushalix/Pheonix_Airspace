// ============================================================
// lib/firestore.ts
// Firestore database helpers
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  addDoc,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";

// ── User Management ───────────────────────────────────────
export async function getAllUsers(limitCount = 50) {
  const q = query(
    collection(db, "users"),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function searchUsers(searchEmail: string) {
  const q = query(
    collection(db, "users"),
    where("email", ">=", searchEmail),
    where("email", "<=", searchEmail + "\uf8ff"),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getUserById(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateUserStatus(
  uid: string,
  status: "active" | "suspended" | "deleted"
) {
  await updateDoc(doc(db, "users", uid), {
    status,
    updatedAt: serverTimestamp(),
  });
}

// ── Audit Logs ────────────────────────────────────────────
export async function writeAuditLog(entry: {
  actorUid: string;
  actorRole: string;
  action: string;
  targetUid?: string;
  metadata?: Record<string, unknown>;
}) {
  await addDoc(collection(db, "audit_logs"), {
    ...entry,
    timestamp: serverTimestamp(),
  });
}

export async function getAuditLogs(limitCount = 100) {
  const q = query(
    collection(db, "audit_logs"),
    orderBy("timestamp", "desc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── Platform Metrics ──────────────────────────────────────
export async function getUserCountByStatus() {
  const [active, suspended] = await Promise.all([
    getDocs(query(collection(db, "users"), where("status", "==", "active"))),
    getDocs(query(collection(db, "users"), where("status", "==", "suspended"))),
  ]);
  return {
    active: active.size,
    suspended: suspended.size,
    total: active.size + suspended.size,
  };
}

export async function getNewUsersThisWeek() {
  const oneWeekAgo = Timestamp.fromDate(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const q = query(
    collection(db, "users"),
    where("createdAt", ">=", oneWeekAgo)
  );
  const snap = await getDocs(q);
  return snap.size;
}

export async function getUsersBySubscription() {
  const tiers = ["free", "student_pro", "professional", "enterprise"];
  const counts: Record<string, number> = {};
  await Promise.all(
    tiers.map(async (tier) => {
      const q = query(
        collection(db, "users"),
        where("subscriptionTier", "==", tier)
      );
      const snap = await getDocs(q);
      counts[tier] = snap.size;
    })
  );
  return counts;
}
