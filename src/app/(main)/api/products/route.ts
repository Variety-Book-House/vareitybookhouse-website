import { NextRequest, NextResponse } from 'next/server'
import pool from '@/neonSetup'
import { Product } from '@/lib/definitions'
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

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams

        const query = searchParams.get('query') || ''
        const genre = searchParams.get('genre') || ''
        const minPrice = parseInt(searchParams.get('minPrice') || '0')
        const maxPrice = parseInt(searchParams.get('maxPrice') || '999999')
        const sortBy = searchParams.get('sortBy') || 'relevance'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '8')
        const offset = (page - 1) * limit

        /* ---------------- BASE WHERE ---------------- */
        let whereSql = `WHERE is_active = true`
        const params: any[] = []
        let idx = 1

        if (query) {
            whereSql += `
              AND (
                title ILIKE $${idx}
                OR author ILIKE $${idx}
                OR description ILIKE $${idx}
              )
            `
            params.push(`%${query}%`)
            idx++
        }

        if (genre) {
            whereSql += ` AND genre = $${idx}`
            params.push(genre)
            idx++
        }

        whereSql += ` AND "MRP" >= $${idx}`
        params.push(minPrice)
        idx++

        whereSql += ` AND "MRP" <= $${idx}`
        params.push(maxPrice)
        idx++

        /* ---------------- COUNT QUERY ---------------- */
        const countSql = `
          SELECT COUNT(*)::int AS count
          FROM products
          ${whereSql}
        `

        const countResult = await pool.query(countSql, params)
        const total = countResult.rows[0].count

        /* ---------------- SORTING ---------------- */
        let orderSql = ''
        switch (sortBy) {
            case 'price-low':
                orderSql = 'ORDER BY "MRP" ASC'
                break
            case 'price-high':
                orderSql = 'ORDER BY "MRP" DESC'
                break
            case 'title':
                orderSql = 'ORDER BY title ASC'
                break
            default:
                orderSql = 'ORDER BY created_at DESC'
        }

        /* ---------------- DATA QUERY ---------------- */
        const dataSql = `
          SELECT *
          FROM products
          ${whereSql}
          ${orderSql}
          LIMIT $${idx} OFFSET $${idx + 1}
        `

        const dataParams = [...params, limit, offset]
        const result = await pool.query(dataSql, dataParams)

        const products = await Promise.all(
            result.rows.map(async (product: Product) => {
                if (product.images?.length) {
                    return product
                }

                const image = await fetchGoogleBookImage(
                    product.title,
                    product.author || ''
                )

                return {
                    ...product,
                    images: image ? [image] : [],
                }
            })
        )

        return NextResponse.json({
            products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        })

    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}
