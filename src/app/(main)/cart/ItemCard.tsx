'use client'

import Image from 'next/image'
import { X, Plus, Minus } from 'lucide-react'
import { CartItem } from '@/lib/cart'

interface CartItemCardProps {
    cartItem: CartItem
    onDelete: () => void
    onUpdateQuantity: (quantity: number) => void
    isUpdating: boolean
}

export default function CartItemCard({
    cartItem,
    onDelete,
    onUpdateQuantity,
    isUpdating
}: CartItemCardProps) {
    const { product, quantity } = cartItem
    const itemTotal = product.MRP * quantity

    return (
        <div className="flex gap-6 py-6 border-b border-black/10 relative">
            {/* IMAGE */}
            <div className="w-[120px] h-[180px] flex-shrink-0 relative bg-gray-100">
                <Image
                    src={product.images?.[0] || '/image 14.png'}
                    alt={product.title}
                    fill
                    className="object-contain"
                />
            </div>

            {/* INFO */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <p className="font-MyFont text-sm tracking-wide pr-8">
                        {product.title.toUpperCase()}
                    </p>
                    <p className="text-xs opacity-50 mt-1">
                        {product.author || 'Unknown Author'}
                    </p>
                    {product.genre && (
                        <p className="text-xs opacity-40 mt-1">
                            {product.genre}
                        </p>
                    )}
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onUpdateQuantity(quantity - 1)}
                            disabled={isUpdating || quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center border border-black/20 rounded hover:bg-black/5 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                        >
                            <Minus size={14} />
                        </button>

                        <span className="text-sm font-medium w-8 text-center">
                            {quantity}
                        </span>

                        <button
                            onClick={() => onUpdateQuantity(quantity + 1)}
                            disabled={isUpdating || quantity >= product.stock}
                            className="w-8 h-8 flex items-center justify-center border border-black/20 rounded hover:bg-black/5 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* PRICE */}
                    <div className="text-right">
                        <p className="text-sm font-semibold">₹{itemTotal.toLocaleString()}</p>
                        {quantity > 1 && (
                            <p className="text-xs opacity-40">
                                ₹{product.MRP} each
                            </p>
                        )}
                    </div>
                </div>

                {/* STOCK WARNING */}
                {product.stock < 5 && product.stock > 0 && (
                    <p className="text-xs text-orange-600 mt-2">
                        Only {product.stock} left in stock
                    </p>
                )}
                {product.stock === 0 && (
                    <p className="text-xs text-red-600 mt-2">
                        Out of stock
                    </p>
                )}
            </div>

            {/* DELETE BUTTON */}
            <button
                onClick={onDelete}
                disabled={isUpdating}
                className="absolute top-2 right-2 opacity-40 hover:opacity-100 transition bg-white rounded-full p-1 shadow disabled:cursor-not-allowed"
                title="Remove item"
            >
                <X size={16} />
            </button>
        </div>
    )
}