// app/api/books/by-genre/route.ts
import { NextResponse } from 'next/server'
import pool from '@/neonSetup'
import { fetchOpenLibraryBookImage } from '@/lib/googlebooksimagehelper'
import { Product } from '@/lib/definitions'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const genre = searchParams.get('genre')
    const limit = Number(searchParams.get('limit') || 10)

    if (!genre) {
        return NextResponse.json(
            { error: 'Genre is required' },
            { status: 400 }
        )
    }

    const BATCH_SIZE = 20
    let offset = 0
    const books: any[] = []

    try {
        while (books.length < limit) {
            const result = await pool.query(
                `
                SELECT *
                FROM products
                WHERE genre = $1
                  AND is_active = true
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
                `,
                [genre, BATCH_SIZE, offset]
            )

            // No more rows in DB
            if (result.rows.length === 0) break

            for (const product of result.rows as Product[]) {
                if (books.length >= limit) break

                let image = product.images?.[0] || null

                if (!image) {
                    image = await fetchOpenLibraryBookImage(
                        product.title,
                        product.author || ''
                    )
                }

                // ❌ Skip product if no image anywhere
                if (!image) continue

                books.push({
                    id: product.id,
                    title: product.title,
                    author: product.author,
                    description: product.description,
                    MRP: product.MRP,
                    images: [image],
                    stock: product.stock,
                    is_active: product.is_active,
                    created_at: product.created_at,
                    updated_at: product.updated_at,
                    genre: product.genre,
                    language: product.language,
                    publisher: product.publisher,
                    barcode: product.barcode,
                })
            }

            offset += BATCH_SIZE
        }

        return NextResponse.json({ books })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to fetch books' },
            { status: 500 }
        )
    }
}
