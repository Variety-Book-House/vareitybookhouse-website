'use client'
import { cn } from "@/lib/utils"
import React, { useEffect, useRef, useState } from 'react'
import ColorThief from 'colorthief'

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
    textSize?: 'sm' | 'md' | 'lg' // optional text size prop
}

const ItemCard = ({
    book,
    liked,
    setLiked,
    onClick,
    className,
    textSize = 'sm' // default small
}: ItemCardProps) => {
    const title = book?.volumeInfo?.title ?? 'Untitled Book'
    const author = book?.volumeInfo?.authors?.[0] ?? 'Unknown Author'
    const price = book?.saleInfo?.listPrice?.amount ?? 299

    const image = '/image 14.png'

    const imgRef = useRef<HTMLImageElement | null>(null)
    const [bgColor, setBgColor] = useState('rgb(20,20,20)')

    useEffect(() => {
        const img = imgRef.current
        if (!img) return

        const colorThief = new ColorThief()

        const extractColor = () => {
            try {
                const [r, g, b] = colorThief.getColor(img)
                setBgColor(`rgb(${r}, ${g}, ${b})`)
            } catch {
                setBgColor('rgb(20,20,20)')
            }
        }

        if (img.complete) {
            extractColor()
        } else {
            img.addEventListener('load', extractColor)
        }

        return () => {
            img.removeEventListener('load', extractColor)
        }
    }, [image])

    // Tailwind classes based on textSize prop
    const sizeClasses = {
        sm: { title: 'text-xs', author: 'text-[10px]', price: 'text-xs' },
        md: { title: 'text-sm', author: 'text-xs', price: 'text-sm' },
        lg: { title: 'text-base', author: 'text-sm', price: 'text-base' },
    }

    const classes = sizeClasses[textSize]

    return (
        <div
            onClick={onClick}
            className={cn(
                `
                h-[400px]
                w-[240px]
                flex flex-col items-center
                text-center
                cursor-pointer
                bg-white
                hover:shadow-md
                transition-shadow
                `,
                className
            )}
        >
            {/* Image */}
            <div
                className="relative w-full aspect-[3/4] overflow-hidden transition-colors duration-300 flex items-center justify-center"
                style={{ backgroundColor: bgColor }}
            >
                <img
                    ref={imgRef}
                    src={image}
                    alt={title}
                    crossOrigin="anonymous"
                    className="object-cover "
                    onError={(e) => (e.currentTarget.src = '/default.jpg')}
                />
            </div>

            {/* Text */}
            <div className="w-full flex flex-col items-center text-center mt-2">
                <h3 className={`font-light leading-snug line-clamp-2 ${classes.title}`}>
                    {title.toUpperCase()}
                </h3>

                <p className={`text-gray-600 ${classes.author}`}>
                    {author.toUpperCase()}
                </p>

                <p className={`font-light ${classes.price}`}>
                    ₹{price}
                </p>
            </div>
        </div>
    )
}

export default ItemCard
