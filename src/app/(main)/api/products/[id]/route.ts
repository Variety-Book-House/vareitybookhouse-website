import { NextRequest, NextResponse } from 'next/server'
import pool from '@/neonSetup'

async function fetchGoogleBookImage(title: string, author?: string) {
    try {
        const q = encodeURIComponent(
            `${title}${author ? `+inauthor:${author}` : ''}`
        )

        const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`
        )

        if (!res.ok) return null

        const data = await res.json()
        const volume = data.items?.[0]

        return (
            volume?.volumeInfo?.imageLinks?.thumbnail ||
            volume?.volumeInfo?.imageLinks?.smallThumbnail ||
            null
        )
    } catch {
        return null
    }
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1 AND is_active = true',
            [id]
        )

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        const product = result.rows[0]

        // 🔹 If product already has images, return directly
        if (product.images?.length) {
            return NextResponse.json(product)
        }

        // 🔹 Fetch image from Google Books
        const image = await fetchGoogleBookImage(
            product.title,
            product.author
        )

        return NextResponse.json({
            ...product,
            images: image ? [image] : [],
        })
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}
