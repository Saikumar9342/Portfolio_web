
const projectId = 'portfolio-86c25';
const apiKey = 'AIzaSyBPmggbdAUzzwwh5UB8ZBFzeXnDNqtmB4w';
const domain = 'saikumar.is-a.dev';
const userId = 'W8ScjbrMSuXBaQm5IWCQ5E6bAsk2';

async function mapDomain() {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/domain_mappings?documentId=${encodeURIComponent(domain)}&key=${apiKey}`;

    const body = {
        fields: {
            userId: { stringValue: userId },
            active: { booleanValue: true },
            updatedAt: { timestampValue: new Date().toISOString() },
            createdAt: { timestampValue: new Date().toISOString() }
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            console.log(`Successfully mapped ${domain} to ${userId}`);
        } else {
            const err = await response.json();
            console.error('Failed:', err);

            // If it already exists, try PATCH
            if (response.status === 409) {
                const patchUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/domain_mappings/${encodeURIComponent(domain)}?key=${apiKey}`;
                const patchResponse = await fetch(patchUrl, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                if (patchResponse.ok) {
                    console.log(`Successfully updated existing mapping for ${domain}`);
                } else {
                    console.error('Patch failed:', await patchResponse.json());
                }
            }
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

mapDomain();
