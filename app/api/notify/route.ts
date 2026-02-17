import { db, messaging, verifyInternalSecret } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // 1. Security Check
        if (!verifyInternalSecret(req)) {
            console.error("--- UNAUTHORIZED NOTIFY ATTEMPT ---");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bodyData = await req.json();
        console.log("--- NOTIFY API CALLED ---");

        const { targetUserId, title, body } = bodyData;

        if (!targetUserId || !title || !body) {
            console.log("--- ERROR: Missing fields ---");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Fetch user's FCM tokens
        const userDoc = await db.collection("users").doc(targetUserId).get();
        const fcmDoc = await db.collection("users").doc(targetUserId).collection("private").doc("fcm").get();

        let tokens: string[] = [];

        if (userDoc.exists) {
            const data = userDoc.data();
            if (data?.fcmToken) tokens.push(data.fcmToken);
            if (data?.fcmTokens && Array.isArray(data.fcmTokens)) {
                tokens.push(...data.fcmTokens);
            }
        }

        if (fcmDoc.exists) {
            const data = fcmDoc.data();
            if (data?.tokens && Array.isArray(data.tokens)) {
                tokens.push(...data.tokens);
            }
        }

        // De-duplicate
        tokens = Array.from(new Set(tokens));

        if (tokens.length === 0) {
            console.log(`--- No tokens found for user ${targetUserId} ---`);
            return NextResponse.json({ message: "No tokens found" }, { status: 200 });
        }

        const message = {
            notification: { title, body },
            tokens: tokens,
        };

        const response = await messaging.sendEachForMulticast(message);
        console.log(`--- SUCCESS: Sent notification to ${response.successCount} devices ---`);

        return NextResponse.json({
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount
        });

    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
