
// lib/openLibrary.ts
export async function fetchOpenLibraryBookImage(
    title: string,
    author?: string
) {
    try {
        const params = new URLSearchParams({
            title,
            ...(author ? { author } : {}),
            limit: '1'
        })

        const res = await fetch(
            `https://openlibrary.org/search.json?${params.toString()}`
        )

        if (!res.ok) return null

        const data = await res.json()
        const doc = data.docs?.[0]

        if (!doc) return null

        // Prefer cover_i (best quality)
        if (doc.cover_i) {
            return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        }

        // Fallback to ISBN-based cover
        if (doc.isbn?.length) {
            return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`
        }

        return null
    } catch {
        return null
    }
}
