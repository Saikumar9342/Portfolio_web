const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
});

async function test() {
    const db = admin.firestore();
    console.log("Checking admin user document...");
    const doc = await db.collection("users").doc("W8ScjbrMSuXBaQm5IWCQ5E6bAsk2").get();
    if (doc.exists) {
        console.log("Document exists!");
        console.log("Fields:", doc.data());
    } else {
        console.log("Document DOES NOT exist!");
    }
}

test();
