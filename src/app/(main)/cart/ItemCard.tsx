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

    const title = product.title || 'Untitled'
    const author = product.author || 'Unknown Author'
    const price = product.MRP ?? 0
    const stock = product.stock ?? 0
    const image = product.images?.[0] || '/image 14.png'

    const itemTotal = price * quantity

    return (
        <div className="flex gap-6 py-6 border-b border-black/10 relative">
            {/* IMAGE */}
            <div className="w-[120px] h-[180px] flex-shrink-0 relative bg-gray-100">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="120px"
                    className="object-contain"
                />
            </div>

            {/* INFO */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <p className="font-MyFont text-sm tracking-wide pr-8">
                        {title.toUpperCase()}
                    </p>

                    <p className="text-xs opacity-50 mt-1">
                        {author}
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
                            className="w-8 h-8 flex items-center justify-center border border-black/20 rounded hover:bg-black/5 transition disabled:opacity-30"
                        >
                            <Minus size={14} />
                        </button>

                        <span className="text-sm font-medium w-8 text-center">
                            {quantity}
                        </span>

                        <button
                            onClick={() => onUpdateQuantity(quantity + 1)}
                            disabled={isUpdating || quantity >= stock}
                            className="w-8 h-8 flex items-center justify-center border border-black/20 rounded hover:bg-black/5 transition disabled:opacity-30"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* PRICE */}
                    <div className="text-right">
                        <p className="text-sm font-semibold">
                            ₹{itemTotal.toLocaleString()}
                        </p>

                        {quantity > 1 && (
                            <p className="text-xs opacity-40">
                                ₹{price} each
                            </p>
                        )}
                    </div>
                </div>

                {/* STOCK WARNINGS */}
                {stock > 0 && stock < 5 && (
                    <p className="text-xs text-orange-600 mt-2">
                        Only {stock} left in stock
                    </p>
                )}

                {stock === 0 && (
                    <p className="text-xs text-red-600 mt-2">
                        Out of stock
                    </p>
                )}
            </div>

            {/* DELETE */}
            <button
                onClick={onDelete}
                disabled={isUpdating}
                className="absolute top-2 right-2 opacity-40 hover:opacity-100 transition bg-white rounded-full p-1 shadow"
            >
                <X size={16} />
            </button>
        </div>
    )
}
