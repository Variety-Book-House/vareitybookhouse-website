// app/api/products/by-type/route.ts
import { NextResponse } from 'next/server'
import pool from '@/neonSetup'
import { fetchOpenLibraryBookImage } from '@/lib/googlebooksimagehelper'
import { Product } from '@/lib/definitions'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const limit = Number(searchParams.get('limit') || 50)

    try {
        /* --------------------------------
           1️⃣ RETURN AVAILABLE TYPES
        -------------------------------- */
        if (!type) {
            const result = await pool.query(`
                SELECT DISTINCT type
                FROM products
                WHERE type IS NOT NULL
                  AND is_active = true
                ORDER BY type
            `)

            return NextResponse.json({
                types: result.rows.map(r => r.type),
            })
        }

        /* --------------------------------
           2️⃣ RETURN BOOKS FOR A TYPE
        -------------------------------- */
        const result = await pool.query(
            `
            SELECT *
            FROM products
            WHERE type = $1
              AND is_active = true
            ORDER BY created_at DESC
            LIMIT $2
            `,
            [type, limit]
        )

        const books = await Promise.all(
            result.rows.map(async (product: Product) => {
                const image =
                    product.images?.[0] ??
                    (await fetchOpenLibraryBookImage(
                        product.title,
                        product.author || ''
                    ))

                // Skip image-less products if needed
                if (!image) return null

                return {
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
                }
            })
        )

        return NextResponse.json({
            books: books.filter(Boolean),
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to fetch by type' },
            { status: 500 }
        )
    }
}
