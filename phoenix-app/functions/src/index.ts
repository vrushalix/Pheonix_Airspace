import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { auth } from "firebase-functions/v1";

// ── Initialize Firebase Admin SDK ────────────────────────
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ============================================================
// AUTH TRIGGER: onUserCreate
// Fires when any new user registers
// Sets default role "public" and creates Firestore profile
// ============================================================
export const onUserCreate = auth.user().onCreate(async (user) => {
  const uid = user.uid;

  // Set custom claim: role = "public"
  await admin.auth().setCustomUserClaims(uid, { role: "public" });

  // Create user document in Firestore
  await db.doc(`users/${uid}`).set({
    uid,
    email: user.email || null,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    role: "public",
    subscriptionTier: "free",
    subscriptionUserCount: 1,
    status: "active",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    gdprConsentAt: null, // Will be set when user accepts cookie banner
    dataRegion: "EU",
  });

  // Create empty telemetry doc
  await db.doc(`telemetry/${uid}`).set({
    uid,
    firstLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    totalLoginCount: 1,
    deviceType: null,
    browser: null,
    country: null,
    referralSource: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
  });

  functions.logger.info(`✅ New user created: ${uid} (${user.email})`);
});

// ============================================================
// CALLABLE: setUserRole
// Admin-only: promote or demote a user's role
// ============================================================
export const setUserRole = onCall(
  { region: "europe-west1" },
  async (request) => {
    // Verify caller is admin
    if (request.auth?.token?.role !== "admin") {
      throw new HttpsError(
        "permission-denied",
        "Only admins can change user roles."
      );
    }

    const { targetUid, newRole } = request.data as {
      targetUid: string;
      newRole: "public" | "employee" | "admin";
    };

    if (!targetUid || !newRole) {
      throw new HttpsError("invalid-argument", "targetUid and newRole required.");
    }

    const validRoles = ["public", "employee", "admin"];
    if (!validRoles.includes(newRole)) {
      throw new HttpsError("invalid-argument", `Invalid role: ${newRole}`);
    }

    // Set Firebase custom claim
    await admin.auth().setCustomUserClaims(targetUid, { role: newRole });

    // Update Firestore user doc
    await db.doc(`users/${targetUid}`).update({
      role: newRole,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Write audit log
    await db.collection("audit_logs").add({
      actorUid: request.auth!.uid,
      actorRole: "admin",
      action: "set_user_role",
      targetUid,
      metadata: { newRole },
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.info(
      `🔑 Role change: ${targetUid} → ${newRole} by ${request.auth!.uid}`
    );

    return { success: true, message: `Role updated to ${newRole}` };
  }
);

// ============================================================
// CALLABLE: suspendUser
// Admin-only: suspend a user account
// ============================================================
export const suspendUser = onCall(
  { region: "europe-west1" },
  async (request) => {
    if (request.auth?.token?.role !== "admin") {
      throw new HttpsError("permission-denied", "Admins only.");
    }

    const { targetUid } = request.data as { targetUid: string };

    // Disable Firebase Auth account
    await admin.auth().updateUser(targetUid, { disabled: true });

    // Update Firestore status
    await db.doc(`users/${targetUid}`).update({
      status: "suspended",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Audit log
    await db.collection("audit_logs").add({
      actorUid: request.auth!.uid,
      actorRole: "admin",
      action: "suspend_user",
      targetUid,
      metadata: {},
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  }
);

// ============================================================
// CALLABLE: reactivateUser
// Admin-only: reactivate a suspended account
// ============================================================
export const reactivateUser = onCall(
  { region: "europe-west1" },
  async (request) => {
    if (request.auth?.token?.role !== "admin") {
      throw new HttpsError("permission-denied", "Admins only.");
    }

    const { targetUid } = request.data as { targetUid: string };

    await admin.auth().updateUser(targetUid, { disabled: false });

    await db.doc(`users/${targetUid}`).update({
      status: "active",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("audit_logs").add({
      actorUid: request.auth!.uid,
      actorRole: "admin",
      action: "reactivate_user",
      targetUid,
      metadata: {},
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  }
);

// ============================================================
// CALLABLE: deleteUserAccount (GDPR Art. 17 — Right to Erasure)
// Can be called by the user themselves OR by admin
// ============================================================
export const deleteUserAccount = onCall(
  { region: "europe-west1" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const callerUid = request.auth.uid;
    const { targetUid } = request.data as { targetUid: string };

    // Only self-deletion or admin deletion allowed
    const isAdmin = request.auth.token.role === "admin";
    if (callerUid !== targetUid && !isAdmin) {
      throw new HttpsError("permission-denied", "Can only delete your own account.");
    }

    // Delete all user data (cascade)
    const batch = db.batch();
    batch.delete(db.doc(`users/${targetUid}`));
    batch.delete(db.doc(`telemetry/${targetUid}`));
    batch.delete(db.doc(`subscriptions/${targetUid}`));
    // Note: consent_records are retained for GDPR proof (anonymized)
    await batch.commit();

    // Delete Firebase Auth account
    await admin.auth().deleteUser(targetUid);

    // Log deletion request
    await db.collection("data_requests").add({
      uid: targetUid,
      type: "deletion",
      status: "completed",
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.info(`🗑️ User deleted: ${targetUid}`);
    return { success: true };
  }
);

// ============================================================
// CALLABLE: getAdminStats
// Admin dashboard: platform metrics
// ============================================================
export const getAdminStats = onCall(
  { region: "europe-west1" },
  async (request) => {
    if (request.auth?.token?.role !== "admin") {
      throw new HttpsError("permission-denied", "Admins only.");
    }

    const oneWeekAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    const oneMonthAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    const [allUsers, newThisWeek, newThisMonth, subscriptionCounts] =
      await Promise.all([
        db.collection("users").where("status", "==", "active").count().get(),
        db
          .collection("users")
          .where("createdAt", ">=", oneWeekAgo)
          .count()
          .get(),
        db
          .collection("users")
          .where("createdAt", ">=", oneMonthAgo)
          .count()
          .get(),
        Promise.all(
          ["free", "student_pro", "professional", "enterprise"].map(
            async (tier) => ({
              tier,
              count: (
                await db
                  .collection("users")
                  .where("subscriptionTier", "==", tier)
                  .count()
                  .get()
              ).data().count,
            })
          )
        ),
      ]);

    return {
      totalActiveUsers: allUsers.data().count,
      newUsersThisWeek: newThisWeek.data().count,
      newUsersThisMonth: newThisMonth.data().count,
      subscriptionBreakdown: Object.fromEntries(
        subscriptionCounts.map(({ tier, count }) => [tier, count])
      ),
    };
  }
);
