'use client'

import { cn } from "@/lib/utils"
import { ProductHeartIcon } from "./icons/ProductHeartIcon"
import { ProductCartIcon } from "./icons/ProductCartIcon"
import { useRouter } from 'next/navigation'
import { X, Heart } from "lucide-react"
import { useState, useEffect } from 'react'
import { Product } from "@/lib/definitions"
interface ItemCardProps {
    book: Product
    className?: string
    show?: boolean
    showDelete?: boolean
    onDelete?: (bookId: string) => void
}

const ItemCard = ({ book, className, show = false, showDelete = false, onDelete }: ItemCardProps) => {
    const router = useRouter()
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)

    const title = book.title ?? 'Untitled'
    const author = book.author ?? 'Unknown'
    const price = book.MRP ?? 299

    // Check if item is in wishlist on mount
    useEffect(() => {
        if (show) return            // 👈 STOP everything
        if (book.id) {
            checkWishlistStatus()
        }
    }, [book.id, show])


    const checkWishlistStatus = async () => {
        if (!book.id) return

        try {
            const response = await fetch(`/api/wishlist/check/${book.id}`)
            const data = await response.json()
            setIsInWishlist(data.inWishlist)
        } catch (error) {
            console.error('Error checking wishlist status:', error)
        }
    }

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

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation()

        if (!book.id || isTogglingWishlist) return

        setIsTogglingWishlist(true)

        try {
            if (isInWishlist) {
                // Remove from wishlist
                const response = await fetch('/api/wishlist/remove', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: book.id }),
                })

                if (response.ok) {
                    setIsInWishlist(false)
                } else if (response.status === 401) {
                    router.push('/login')
                }
            } else {
                // Add to wishlist
                const response = await fetch('/api/wishlist/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId: book.id,
                        productDetails: {
                            title: book.title,
                            authors: [book.author],
                            thumbnail: book.images?.[0] || null,
                            price: book.MRP
                        }
                    }),
                })

                if (response.ok) {
                    setIsInWishlist(true)
                } else if (response.status === 401) {
                    router.push('/login')
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error)
        } finally {
            setIsTogglingWishlist(false)
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
                console.log('Added to cart successfully')
            } else if (response.status === 401) {
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
                    src={book.images?.[0] || "/image 14.png"}
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

                {!show && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                            className="transition-opacity hover:opacity-70 disabled:opacity-40"
                            title="Add to cart"
                        >
                            <ProductCartIcon />
                        </button>

                        <button
                            onClick={handleToggleWishlist}
                            disabled={isTogglingWishlist}
                            className="transition-all hover:scale-110 disabled:opacity-40"
                            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart
                                size={20}
                                className={
                                    isInWishlist
                                        ? "fill-red-500 text-red-500"
                                        : "text-gray-400"
                                }
                            />
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ItemCard