import admin from "firebase-admin";

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

console.log("--- FIREBASE ADMIN CONFIG ---");
console.log("Proj ID:", serviceAccount.projectId);
console.log("Client Email:", serviceAccount.clientEmail);
console.log("Private Key Length:", serviceAccount.privateKey ? serviceAccount.privateKey.length : "MISSING");

if (!admin.apps.length) {
    try {
        if (serviceAccount.clientEmail && serviceAccount.privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.projectId
            });
            console.log("--- FIREBASE ADMIN INIT SUCCESS ---");
        } else {
            console.warn("--- FIREBASE ADMIN: Missing Email or Key. Skipping Init (Build safe) ---");
        }
    } catch (e) {
        console.error("--- FIREBASE ADMIN INIT ERROR (Non-fatal) ---", e);
    }
}


let db: admin.firestore.Firestore;
let messaging: admin.messaging.Messaging;

try {
    if (admin.apps.length > 0) {
        db = admin.firestore();
        messaging = admin.messaging();
    }
} catch (e) {
    console.error("Firebase services initialization failed:", e);
}

// @ts-ignore
export { admin, db, messaging };

export const verifyInternalSecret = (req: Request) => {
    const secret = process.env.INTERNAL_NOTIFY_SECRET;
    const providedSecret = req.headers.get("x-internal-secret");

    // If no secret is configured, we allow it (for retro-compatibility during setup)
    // but in production, this should be enforced.
    if (!secret) return true;

    return secret === providedSecret;
};
