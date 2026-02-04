// app/api/bestsellers/route.ts
import { NextResponse } from 'next/server'
import pool from '@/neonSetup'
import { fetchOpenLibraryBookImage } from '@/lib/googlebooksimagehelper'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '10')

        const bestSellersQuery = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p."MRP",
        p.images,
        p.genre,
        p.language,
        p.publisher,
        p.author,
        p.barcode,
        COALESCE(SUM(oi.quantity), 0) as total_sold
      FROM products p
      LEFT JOIN order_items oi ON p.id::text = oi.product_id
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY total_sold DESC, p.created_at DESC
      LIMIT $1
    `

        let { rows } = await pool.query(bestSellersQuery, [limit])

        // Fallback to random books if no sales
        if (rows.length === 0 || rows.every((r: any) => r.total_sold === 0)) {
            const randomQuery = `
        SELECT 
          id,
          title,
          description,
          mrp,
          images,
          genre,
          language,
          publisher,
          author,
          barcode
        FROM products
        WHERE is_active = true
        ORDER BY RANDOM()
        LIMIT $1
      `
            const randomResult = await pool.query(randomQuery, [limit])
            rows = randomResult.rows
        }

        // 🔥 Enrich missing images using Google Books
        const enriched = await Promise.all(
            rows.map(async (book: any) => {
                if (book.images?.length) return book

                const googleImages = await fetchOpenLibraryBookImage(
                    book.title,
                    book.author,

                )

                return {
                    ...book,
                    images: googleImages ?? []
                }
            })
        )

        return NextResponse.json({
            success: true,
            data: enriched,
            isBestSeller: true
        })

    } catch (error) {
        console.error('Error fetching best sellers:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch best sellers',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
