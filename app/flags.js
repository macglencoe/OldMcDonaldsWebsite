let lastKnownGood = null;

export async function loadFlags() {
    try {
        const res = await fetch(process.env.FLAGS_URL, {
            next: { revalidate: 30 },
            headers: { Accept: 'application/json' }
        })
        const json = await res.json();
        lastKnownGood = json;
        return json;
    } catch (err) {
        console.error("Failed to load flags", err);
        return lastknownGood || {}
    }
}