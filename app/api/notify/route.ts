
import { NextResponse } from "next/server";
import { admin, db, messaging } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const bodyData = await req.json();
        console.log("--- NOTIFY API CALLED ---");
        console.log("Request Body:", JSON.stringify(bodyData, null, 2));

        const { targetUserId, title, body } = bodyData;

        if (!targetUserId || !title || !body) {
            console.log("--- ERROR: Missing fields ---");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Fetch user's FCM tokens from Firestore
        const userDoc = await db.collection("users").doc(targetUserId).get();
        if (!userDoc.exists) {
            console.log(`--- ERROR: User ${targetUserId} not found in Firestore ---`);
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userData = userDoc.data();
        // Support both single token 'fcmToken' and array 'fcmTokens'
        let tokens: string[] = userData?.fcmTokens || [];

        // Add single token if it exists and isn't already in the list
        if (userData?.fcmToken && !tokens.includes(userData.fcmToken)) {
            tokens.push(userData.fcmToken);
        }

        if (tokens.length === 0) {
            return NextResponse.json({ message: "No devices registered for notifications" });
        }

        // Send multicast message
        const message: any = {
            notification: {
                title,
                body,
            },
            data: {
                click_action: "FLUTTER_NOTIFICATION_CLICK",
                sound: "default"
            },
            tokens: tokens, // sendEachForMulticast handles this list
        };

        console.log(`--- SENDING VIA sendEachForMulticast to ${tokens.length} tokens ---`);
        // Using sendEachForMulticast to avoid legacy /batch endpoint issues
        const response = await messaging.sendEachForMulticast(message);
        console.log(`--- SENT: Success=${response.successCount}, Fail=${response.failureCount} ---`);

        // Clean up invalid tokens
        if (response.failureCount > 0) {
            const failedTokens: string[] = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(tokens[idx]);
                }
            });

            if (failedTokens.length > 0) {
                const updateData: any = {
                    fcmTokens: admin.firestore.FieldValue.arrayRemove(...failedTokens)
                };

                // If the single token failed, remove it too
                if (userData?.fcmToken && failedTokens.includes(userData.fcmToken)) {
                    updateData.fcmToken = admin.firestore.FieldValue.delete();
                }

                await db.collection("users").doc(targetUserId).update(updateData);
            }
        }

        return NextResponse.json({
            success: true,
            sentCount: response.successCount,
            failureCount: response.failureCount
        });

    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
