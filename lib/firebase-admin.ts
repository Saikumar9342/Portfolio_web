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
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.projectId
        });
        console.log("--- FIREBASE ADMIN INIT SUCCESS ---");
    } catch (e) {
        console.error("--- FIREBASE ADMIN INIT ERROR ---", e);
    }
}

const db = admin.firestore();
const messaging = admin.messaging();

export { admin, db, messaging };
