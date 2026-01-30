import pool from '@/neonSetup'
import { Product } from '@/lib/definitions'

export interface CartItem {
    id: string
    cart_id: string
    product_id: string
    quantity: number
    product: Product
}

export async function getUserCartItems(userId: string): Promise<CartItem[]> {
    try {
        // First, get or create the user's cart
        let cartResult = await pool.query(
            'SELECT id FROM carts WHERE user_id = $1',
            [userId]
        )

        let cartId: string

        if (cartResult.rows.length === 0) {
            // Create a new cart for the user
            const newCart = await pool.query(
                'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
                [userId]
            )
            cartId = newCart.rows[0].id
        } else {
            cartId = cartResult.rows[0].id
        }

        // Get all cart items with product details
        const result = await pool.query(
            `SELECT 
        ci.id,
        ci.cart_id,
        ci.product_id,
        ci.quantity,
        p.id as "p_id",
        p.title,
        p.description,
        p."MRP",
        p.images,
        p.stock,
        p.is_active,
        p.created_at,
        p.updated_at,
        p.genre,
        p.language,
        p.publication,
        p.author,
        p.barcode
      FROM cart_items ci
      INNER JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1 AND p.is_active = true
      ORDER BY ci.id DESC`,
            [cartId]
        )

        return result.rows.map((row: any) => ({
            id: row.id,
            cart_id: row.cart_id,
            product_id: row.product_id,
            quantity: row.quantity,
            product: {
                id: row.p_id,
                title: row.title,
                description: row.description,
                MRP: row.MRP,
                images: row.images,
                stock: row.stock,
                is_active: row.is_active,
                created_at: row.created_at,
                updated_at: row.updated_at,
                genre: row.genre,
                language: row.language,
                publication: row.publication,
                author: row.author,
                barcode: row.barcode,
            }
        }))
    } catch (error) {
        console.error('Error fetching cart items:', error)
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