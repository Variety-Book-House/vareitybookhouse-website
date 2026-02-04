import pool from '@/neonSetup'

import { fetchOpenLibraryBookImage } from '@/lib/googlebooksimagehelper'
import { Product } from '@/lib/definitions'
export interface WishlistItem {
    id: string
    user_id: string
    product_id: string
    title?: string
    authors?: string[]
    thumbnail_url?: string
    price?: number
    created_at: Date
}

export interface WishlistSettings {
    user_id: string
    is_public: boolean
}

/* ---------------- ADD TO WISHLIST ---------------- */
export async function addToWishlist(
    userId: string,
    productId: string,
    productDetails?: {
        title?: string
        authors?: string[]
        thumbnail?: string
        price?: number
    }
) {
    try {
        const authorsJson = productDetails?.authors
            ? JSON.stringify(productDetails.authors)
            : null

        await pool.query(
            `
      INSERT INTO wishlist_items
        (user_id, product_id, title, authors, thumbnail_url, price)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, product_id) DO NOTHING
      `,
            [
                userId,
                productId,
                productDetails?.title ?? null,
                authorsJson,
                productDetails?.thumbnail ?? null,
                productDetails?.price ?? null,
            ]
        )

        return { success: true }
    } catch (error) {
        console.error('Error adding to wishlist:', error)
        return { success: false, error }
    }
}

/* ---------------- REMOVE FROM WISHLIST ---------------- */
export async function removeFromWishlist(userId: string, productId: string) {
    try {
        await pool.query(
            `
      DELETE FROM wishlist_items
      WHERE user_id = $1 AND product_id = $2
      `,
            [userId, productId]
        )

        return { success: true }
    } catch (error) {
        console.error('Error removing from wishlist:', error)
        return { success: false, error }
    }
}


export async function getUserWishlist(userId: string): Promise<Product[]> {
    const result = await pool.query(
        `
  SELECT
      w.product_id,
      p.title,
      p.author,
      p.description,
      p."MRP",
      p.images,
      p.stock,
      p.genre,
      p.language,
      p.publisher,
      p.barcode,
      p.is_active,
      p.created_at,
      p.updated_at
  FROM wishlist_items w
  JOIN products p ON p.id = w.product_id
  WHERE w.user_id = $1
  ORDER BY w.created_at DESC
  `,
        [userId]
    )



    return Promise.all(
        result.rows.map(async (row: Product) => {
            const image =
                row.images?.[0] ??
                (await fetchOpenLibraryBookImage(row.title, row.author))

            return {
                id: row.id,
                title: row.title,
                author: row.author,
                description: row.description,
                MRP: row.MRP,
                images: image ? [image] : ['/image 14.png'],
                stock: row.stock,
                genre: row.genre,
                language: row.language,
                publisher: row.publisher,
                barcode: row.barcode,
                is_active: row.is_active,
                created_at: row.created_at,
                updated_at: row.updated_at,
            }
        })
    )
}


/* ---------------- CHECK IF IN WISHLIST ---------------- */
export async function isInWishlist(
    userId: string,
    productId: string
): Promise<boolean> {
    try {
        const { rowCount } = await pool.query(
            `
      SELECT 1
      FROM wishlist_items
      WHERE user_id = $1 AND product_id = $2
      LIMIT 1
      `,
            [userId, productId]
        )

        return rowCount === 1
    } catch (error) {
        console.error('Error checking wishlist:', error)
        return false
    }
}

/* ---------------- UPDATE VISIBILITY ---------------- */
export async function updateWishlistVisibility(
    userId: string,
    isPublic: boolean
) {
    try {
        await pool.query(
            `
      INSERT INTO wishlist_settings (user_id, is_public, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id)
      DO UPDATE
      SET is_public = EXCLUDED.is_public,
          updated_at = CURRENT_TIMESTAMP
      `,
            [userId, isPublic]
        )

        return { success: true }
    } catch (error) {
        console.error('Error updating wishlist visibility:', error)
        return { success: false, error }
    }
}

/* ---------------- GET WISHLIST SETTINGS ---------------- */
export async function getWishlistSettings(
    userId: string
): Promise<WishlistSettings> {
    try {
        const { rows } = await pool.query(
            `
      SELECT user_id, is_public
      FROM wishlist_settings
      WHERE user_id = $1
      `,
            [userId]
        )

        return rows[0] ?? { user_id: userId, is_public: false }
    } catch (error) {
        console.error('Error fetching wishlist settings:', error)
        return { user_id: userId, is_public: false }
    }
}

/* ---------------- GET PUBLIC WISHLIST ---------------- */
export async function getPublicWishlist(
    userId: string
): Promise<Product[] | null> {
    try {
        const settings = await getWishlistSettings(userId)

        if (!settings.is_public) return null

        return await getUserWishlist(userId)
    } catch (error) {
        console.error('Error fetching public wishlist:', error)
        return null
    }
}
