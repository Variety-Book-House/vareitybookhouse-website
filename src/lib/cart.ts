import pool from '@/neonSetup'
import { Product } from '@/lib/definitions'
import { fetchOpenLibraryBookImage } from './googlebooksimagehelper'

export interface CartItem {
    id: string
    cart_id: string
    product_id: string
    quantity: number
    product: Product
}
export async function getUserCartItems(userId: string): Promise<CartItem[]> {
    try {
        // get or create cart
        const cartRes = await pool.query(
            `SELECT id FROM carts WHERE user_id = $1`,
            [userId]
        )

        const cartId =
            cartRes.rows[0]?.id ??
            (
                await pool.query(
                    `INSERT INTO carts (user_id) VALUES ($1) RETURNING id`,
                    [userId]
                )
            ).rows[0].id

        const result = await pool.query(
            `
  SELECT
    ci.id        AS cart_item_id,
    ci.cart_id,
    ci.product_id,
    ci.quantity,

    p.id,
    p.title,
    p.description,
    p."MRP",
    p.images,
    p.stock,
    p.genre,
    p.language,
    p.publisher,
    p.author,
    p.barcode,
    p.is_active,
    p.created_at,
    p.updated_at
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE ci.cart_id = $1
    AND p.is_active = true
  ORDER BY ci.id DESC
  `,
            [cartId]
        )


        return Promise.all(
            result.rows.map(async (row: any) => {
                let image =
                    row.images?.[0] ??
                    (await fetchOpenLibraryBookImage(row.title, row.author))

                return {
                    id: row.cart_item_id,
                    cart_id: row.cart_id,
                    product_id: row.product_id,
                    quantity: row.quantity,
                    product: {
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        MRP: row.MRP,
                        images: image ? [image] : ['/image 14.png'],
                        stock: row.stock,
                        genre: row.genre,
                        language: row.language,
                        publisher: row.publisher,
                        author: row.author,
                        barcode: row.barcode,
                        is_active: row.is_active,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                    },
                }
            })
        )

    } catch (err) {
        console.error('Error fetching cart:', err)
        return []
    }
}


export async function addToCart(userId: string, productId: string, quantity: number = 1) {
    try {
        // Get or create cart
        let cartResult = await pool.query(
            'SELECT id FROM carts WHERE user_id = $1',
            [userId]
        )

        let cartId: string

        if (cartResult.rows.length === 0) {
            const newCart = await pool.query(
                'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
                [userId]
            )
            cartId = newCart.rows[0].id
        } else {
            cartId = cartResult.rows[0].id
        }

        // Check if item already exists in cart
        const existingItem = await pool.query(
            'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
            [cartId, productId]
        )

        if (existingItem.rows.length > 0) {
            // Update quantity
            await pool.query(
                'UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2',
                [quantity, existingItem.rows[0].id]
            )
        } else {
            // Insert new item
            await pool.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
                [cartId, productId, quantity]
            )
        }

        return { success: true }
    } catch (error) {
        console.error('Error adding to cart:', error)
        return { success: false, error: 'Failed to add to cart' }
    }
}

export async function removeFromCart(userId: string, productId: string) {
    try {
        const cartResult = await pool.query(
            'SELECT id FROM carts WHERE user_id = $1',
            [userId]
        )

        if (cartResult.rows.length === 0) {
            return { success: false, error: 'Cart not found' }
        }

        const cartId = cartResult.rows[0].id

        await pool.query(
            'DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2',
            [cartId, productId]
        )

        return { success: true }
    } catch (error) {
        console.error('Error removing from cart:', error)
        return { success: false, error: 'Failed to remove from cart' }
    }
}

export async function updateCartItemQuantity(userId: string, productId: string, quantity: number) {
    try {
        const cartResult = await pool.query(
            'SELECT id FROM carts WHERE user_id = $1',
            [userId]
        )

        if (cartResult.rows.length === 0) {
            return { success: false, error: 'Cart not found' }
        }

        const cartId = cartResult.rows[0].id

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            await pool.query(
                'DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2',
                [cartId, productId]
            )
        } else {
            await pool.query(
                'UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3',
                [quantity, cartId, productId]
            )
        }

        return { success: true }
    } catch (error) {
        console.error('Error updating cart item quantity:', error)
        return { success: false, error: 'Failed to update quantity' }
    }
}

export async function clearCart(userId: string) {
    try {
        const cartResult = await pool.query(
            'SELECT id FROM carts WHERE user_id = $1',
            [userId]
        )

        if (cartResult.rows.length === 0) {
            return { success: false, error: 'Cart not found' }
        }

        const cartId = cartResult.rows[0].id

        await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId])

        return { success: true }
    } catch (error) {
        console.error('Error clearing cart:', error)
        return { success: false, error: 'Failed to clear cart' }
    }
}