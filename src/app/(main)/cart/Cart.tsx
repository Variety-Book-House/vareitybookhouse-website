'use client'

import CartItemCard from './ItemCard'
import { useState } from 'react'
import Link from 'next/link'
import { CartItem } from '@/lib/cart'

interface CartClientProps {
    initialCartItems: CartItem[]
    userId: string
}

export default function CartClient({ initialCartItems, userId }: CartClientProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
    const [isUpdating, setIsUpdating] = useState(false)

    const removeFromCart = async (productId: string) => {
        setIsUpdating(true)

        // Optimistically update UI
        setCartItems(prev => prev.filter(item => item.product_id !== productId))

        try {
            const response = await fetch('/api/cart/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            })

            if (!response.ok) {
                // Revert on error
                setCartItems(initialCartItems)
                console.error('Failed to remove item from cart')
            }
        } catch (error) {
            // Revert on error
            setCartItems(initialCartItems)
            console.error('Error removing item:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(productId)
            return
        }

        setIsUpdating(true)

        // Optimistically update UI
        setCartItems(prev =>
            prev.map(item =>
                item.product_id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        )

        try {
            const response = await fetch('/api/cart/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: newQuantity }),
            })

            if (!response.ok) {
                // Revert on error
                setCartItems(initialCartItems)
                console.error('Failed to update quantity')
            }
        } catch (error) {
            // Revert on error
            setCartItems(initialCartItems)
            console.error('Error updating quantity:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.product.MRP * item.quantity),
        0
    )

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    if (cartItems.length === 0) {
        return (
            <div className="bg-white min-h-screen pt-[var(--navbar-h)] px-6 md:px-12">
                <h1 className="font-MyFont font-extralight text-[clamp(1.5rem,1vh,5rem)] mb-16">
                    SHOPPING BAG
                </h1>
                <div className="text-center py-20">
                    <p className="text-lg opacity-50 mb-8">Your cart is empty</p>
                    <Link
                        href="/search"
                        className="inline-block px-8 py-3 bg-black text-white text-sm tracking-widest uppercase hover:bg-black/90 transition"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen pt-[var(--navbar-h)] px-6 md:px-12">
            <h1 className="font-MyFont font-extralight text-[clamp(1.5rem,1vh,5rem)] mb-4">
                SHOPPING BAG
            </h1>
            <p className="text-sm opacity-50 mb-16">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>

            <div className="flex flex-col lg:flex-row gap-20">
                {/* CART ITEMS */}
                <div className="flex-1 flex flex-col gap-6">
                    {cartItems.map(item => (
                        <CartItemCard
                            key={item.id}
                            cartItem={item}
                            onDelete={() => removeFromCart(item.product_id)}
                            onUpdateQuantity={(newQty) => updateQuantity(item.product_id, newQty)}
                            isUpdating={isUpdating}
                        />
                    ))}
                </div>

                {/* ORDER SUMMARY */}
                <div className="w-full lg:w-[320px]">
                    <div className="sticky top-[calc(var(--navbar-h)+2rem)]">
                        <p className="text-xs uppercase tracking-widest opacity-50 mb-8">
                            Order Summary
                        </p>

                        <div className="flex justify-between text-sm mb-4">
                            <span>Subtotal ({totalItems} items)</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-sm mb-8">
                            <span>Shipping</span>
                            <span className="opacity-50">Calculated at checkout</span>
                        </div>

                        <div className="flex justify-between text-lg font-light border-t border-black/10 pt-6 mb-10">
                            <span>Total</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>

                        <button
                            className="w-full py-4 bg-black text-white text-sm tracking-widest uppercase hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUpdating}
                        >
                            Proceed to Checkout
                        </button>

                        <Link
                            href="/search"
                            className="block text-center text-xs tracking-wide uppercase opacity-50 hover:opacity-100 transition mt-6"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}