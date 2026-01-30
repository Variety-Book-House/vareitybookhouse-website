'use client'

import { cn } from "@/lib/utils"
import { ProductHeartIcon } from "./icons/ProductHeartIcon"
import { ProductCartIcon } from "./icons/ProductCartIcon"
import { useRouter } from 'next/navigation'
import { X } from "lucide-react"
import { useState } from 'react'

export interface Book {
    id?: string
    volumeInfo?: {
        title?: string
        authors?: string[]
        imageLinks?: { thumbnail?: string }
    }
    saleInfo?: {
        listPrice?: { amount?: number }
    }
}

interface ItemCardProps {
    book: Book
    className?: string
    show?: boolean
    showDelete?: boolean
    onDelete?: (bookId: string) => void
}

const ItemCard = ({ book, className, show = false, showDelete = false, onDelete }: ItemCardProps) => {
    const router = useRouter()
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    const title = book.volumeInfo?.title ?? 'Untitled'
    const author = book.volumeInfo?.authors?.[0] ?? 'Unknown'
    const price = book.saleInfo?.listPrice?.amount ?? 299

    const handleClick = () => {
        if (!book.id) return
        router.push(`/item/${book.id}`)
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (book.id && onDelete) {
            onDelete(book.id)
        }
    }

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation()

        if (!book.id || isAddingToCart) return

        setIsAddingToCart(true)

        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: book.id,
                    quantity: 1
                }),
            })

            if (response.ok) {
                // Optional: Show success message or toast
                console.log('Added to cart successfully')
            } else if (response.status === 401) {
                // Redirect to login if not authenticated
                router.push('/login')
            } else {
                console.error('Failed to add to cart')
            }
        } catch (error) {
            console.error('Error adding to cart:', error)
        } finally {
            setIsAddingToCart(false)
        }
    }

    return (
        <div
            onClick={handleClick}
            className={cn(
                `
        relative
        flex flex-col bg-white cursor-pointer overflow-hidden
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-[2px]
        ${show ? 'w-[200px] h-[320px]' : 'w-[150px] h-[230px] sm:w-[160px] sm:h-[280px] lg:w-[200px] lg:h-[320px]'}`,
                className
            )}
        >
            {/* DELETE ICON */}
            {showDelete && (
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/90 hover:bg-red-500 hover:text-white transition"
                    title="Remove from Wishlist"
                >
                    <X size={16} />
                </button>
            )}

            {/* IMAGE */}
            <div
                className={`bg-[#e3e3e3] flex items-center justify-center
          ${show ? 'h-[220px]' : 'h-[150px] sm:h-[180px] lg:h-[220px]'}`}
            >
                <img
                    src={book.volumeInfo?.imageLinks?.thumbnail || "/image 14.png"}
                    alt={title}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* TEXT */}
            <div
                className={`flex justify-between px-3 py-2
           ${show ? 'h-[100px]' : 'h-[80px] sm:h-[100px] lg:h-[100px]'}`}
            >
                <div className="flex-1 min-w-0">
                    <h3 className={`truncate ${show ? 'text-[14px]' : 'text-[12px] sm:text-[12px] lg:text-[14px]'}`}>
                        {title.toUpperCase()}
                    </h3>
                    <p className={`uppercase tracking-widest text-neutral-500 font-light truncate ${show ? 'text-[12px]' : 'text-[10px] sm:text-[10px] lg:text-[12px]'}`}>
                        {author}
                    </p>
                    <p className={`${show ? 'text-[12px]' : 'text-[12px] sm:text-[12px] lg:text-[14px]'}`}>
                        ₹{price}
                    </p>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="transition-opacity hover:opacity-70 disabled:opacity-40"
                        title="Add to cart"
                    >
                        <ProductCartIcon />
                    </button>
                    <ProductHeartIcon />
                </div>
            </div>
        </div>
    )
}

export default ItemCard