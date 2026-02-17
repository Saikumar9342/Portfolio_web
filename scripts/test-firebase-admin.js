const admin = require("firebase-admin");
require("dotenv").config({ path: ".env.local" });

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

console.log("--- CONFIG CHECK ---");
console.log("Project ID:", serviceAccount.projectId);
console.log("Client Email:", serviceAccount.clientEmail);
console.log("Private Key Length:", serviceAccount.privateKey ? serviceAccount.privateKey.length : "MISSING");

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    console.log("--- FIREBASE ADMIN INITIALIZED SUCCESSFULLY ---");

    // Try to list users to verify permissions (if enabled) or just check db
    const db = admin.firestore();
    console.log("--- ATTEMPTING FIRESTORE CONNECTION ---");
    db.listCollections().then(() => {
        console.log("--- FIRESTORE CONNECTED! ---");
    }).catch(e => {
        console.error("--- FIRESTORE ERROR:", e.message);
    });

} catch (error) {
    console.error("--- INITIALIZATION ERROR ---");
    console.error(error);
}
