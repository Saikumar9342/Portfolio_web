const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, increment } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
    try {
        const userRef = doc(db, "users", "W8ScjbrMSuXBaQm5IWCQ5E6bAsk2");
        console.log("Attempting to increment user totalVisits (unauthenticated)...");
        await setDoc(userRef, { totalVisits: increment(1) }, { merge: true });
        console.log("Success! user increment worked.");
    } catch (e) {
        console.error("Failed user increment:", e.message);
    }

    try {
        const globalRef = doc(db, "analytics", "global");
        console.log("Attempting to increment global totalVisits (unauthenticated)...");
        await setDoc(globalRef, { totalVisits: increment(1) }, { merge: true });
        console.log("Success! global increment worked.");
    } catch (e) {
        console.error("Failed global increment:", e.message);
    }
}

test();
