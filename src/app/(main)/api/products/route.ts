import { NextRequest, NextResponse } from 'next/server'
import pool from '@/neonSetup'
import { Product } from '@/lib/definitions'
import { fetchOpenLibraryBookImage } from '@/lib/googlebooksimagehelper'

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
                let image =
                    product.images?.[0] ??
                    (await fetchOpenLibraryBookImage(product.title, product.author || ''))

                return {
                    id: product.id,
                    title: product.title,
                    author: product.author,
                    description: product.description,
                    MRP: product.MRP,
                    images: image ? [image] : ['/image 14.png'],
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
