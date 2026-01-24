'use client'
import { cn } from "@/lib/utils"
import { ProductHeartIcon } from "./icons/ProductHeartIcon"
import { ProductCartIcon } from "./icons/ProductCartIcon"
import React from 'react'

export interface Book {
    id?: string
    volumeInfo?: {
        title?: string
        authors?: string[]
        categories?: string[]
        imageLinks?: {
            thumbnail?: string
        }
    }
    saleInfo?: {
        listPrice?: {
            amount?: number
        }
    }
}

interface ItemCardProps {
    book: Book
    liked: string[]
    setLiked: React.Dispatch<React.SetStateAction<string[]>>
    onClick?: () => void
    className?: string
    size?: 'xl' | 'sm' | 'md' | 'lg'
}

const SIZE_CONFIG = {
    sm: {
        card: 'w-[160px] h-[260px]',
        image: 'h-[180px]',
        textHeight: 'h-[80px]',
        title: 'text-[10px]',
        author: 'text-[10px]',
        price: 'text-[10px]',
    },
    md: {
        card: 'w-[200px] h-[320px]',
        image: 'h-[220px]',
        textHeight: 'h-[100px]',
        title: 'text-xs',
        author: 'text-[10px]',
        price: 'text-xs',
    },
    lg: {
        card: 'w-[260px] h-[420px]',
        image: 'h-[300px]',
        textHeight: 'h-[120px]',
        title: 'text-[16px]',
        author: 'text-sm',
        price: 'text-[16px]',
    },
    xl: {
        card: 'w-[320px] h-[460px]',
        image: 'h-[340px]',
        textHeight: 'h-[120px]',
        title: 'text-xl',
        author: 'text-lg',
        price: 'text-xl',
    },
}

const ItemCard = ({
    book,
    liked,
    setLiked,
    onClick,
    className,
    size = 'md',
}: ItemCardProps) => {
    const title = book?.volumeInfo?.title ?? 'Untitled Book'
    const author = book?.volumeInfo?.authors?.[0] ?? 'Unknown Author'
    const price = book?.saleInfo?.listPrice?.amount ?? 299

    const image = '/image 14.png'

    const styles = SIZE_CONFIG[size]

    return (
        <div
            onClick={onClick}
            className={cn(
                `
        flex flex-col
        bg-white
        cursor-pointer
        overflow-hidden
        transition-all duration-300 ease-out
        hover:shadow-lg
        hover:-translate-y-[2px]
        `,
                styles.card,
                className
            )}
        >
            {/* IMAGE */}
            <div
                className={cn(
                    'relative overflow-hidden py-2 bg-[#fff1e2] flex items-center justify-center',
                    styles.image
                )}
            >
                <img
                    src={image}
                    alt={title}
                    className="object-contain w-full h-full"
                    onError={(e) => (e.currentTarget.src = '/default.jpg')}
                />
            </div>

            {/* TEXT + ACTIONS */}
            <div
                className={cn(
                    'flex justify-between items-start px-3 py-2',
                    styles.textHeight
                )}
            >
                {/* Text */}
                <div className="flex flex-col justify-between text-left">
                    <h3
                        className={cn(
                            'font-light line-clamp-2',
                            styles.title
                        )}
                    >
                        {title.toUpperCase()}
                    </h3>
                    <p
                        className={cn(
                            'text-light tracking-[0.12em] uppercase mt-1',
                            styles.author
                        )}
                    >
                        {author}
                    </p>
                    <p
                        className={cn(
                            'font-light text-neutral-900 mt-1',
                            styles.price
                        )}
                    >
                        ₹{price}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center justify-between gap-2">
                    <button className="p-2 text-neutral-500 hover:text-neutral-900 transition-all active:scale-95">
                        <ProductCartIcon />
                    </button>
                    <button className="p-2 text-neutral-500 hover:text-red-500 transition-all active:scale-95">
                        <ProductHeartIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ItemCard
