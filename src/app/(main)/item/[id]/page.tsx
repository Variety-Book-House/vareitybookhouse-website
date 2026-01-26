'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { HeartIcon } from '@/components/icons/HeartIcon'
import { CartIcon } from '@/components/icons/CartIcon'
import { Book } from '@/components/ItemCard'

interface ItemDetailPageProps {
    book: Book
}

export default function ItemDetailPage({ book }: ItemDetailPageProps) {
    const router = useRouter()
    const [quantity, setQuantity] = useState(1)
    const [liked, setLiked] = useState(false)
    const [mainImage, setMainImage] = useState<string>(
        '/Image 14.png'
    )

    // Mock thumbnails
    const thumbnails = [
        '/Image 14.png',
        '/Image 14.png',
        '/Image 14.png',
    ]

    const price = 400

    return (
        <div className="flex flex-col md:flex-row pt-[var(--navbar-h)] min-h-screen bg-white">

            {/* LEFT: IMAGE + THUMBNAILS */}
            <div className="md:w-1/2 w-full flex flex-col items-center">
                <div className="relative w-full h-[60vh] md:h-screen flex justify-center items-center bg-[#f5f5f5]">
                    <Image
                        src={mainImage}
                        alt={'Book Image'}
                        fill
                        className="object-contain"
                    />
                </div>

                {/* THUMBNAILS */}
                <div className="flex gap-4 mt-4 px-4 md:px-16 overflow-x-auto scrollbar-none">
                    {thumbnails.map((thumb, idx) => (
                        <div
                            key={idx}
                            onClick={() => setMainImage(thumb)}
                            className={`flex-shrink-0 w-20 h-28 border ${mainImage === thumb ? 'border-black' : 'border-gray-300'
                                } cursor-pointer transition-transform hover:scale-105`}
                        >
                            <Image
                                src={thumb}
                                alt={`Thumbnail ${idx + 1}`}
                                width={80}
                                height={112}
                                className="object-contain w-full h-full"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: INFO */}
            <div className="md:w-1/2 w-full flex flex-col p-8 md:p-16 justify-start">

                {/* CATEGORY & TITLE */}
                <p className="text-xs tracking-widest uppercase opacity-50 mb-2">
                    BOOK
                </p>
                <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
                    {'TITLE'}
                </h1>
                <p className="text-sm md:text-base text-gray-600 mb-6">
                    {'AUTHOR'}
                </p>

                {/* PRICE */}
                <p className="text-2xl md:text-3xl font-medium mb-8">₹{price}</p>

                {/* QUANTITY + ACTIONS */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center border border-black/20 rounded">
                        <button
                            className="px-4 py-2 text-lg font-light hover:bg-black/5 transition"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            -
                        </button>
                        <span className="px-6 text-lg font-light">{quantity}</span>
                        <button
                            className="px-4 py-2 text-lg font-light hover:bg-black/5 transition"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={() => console.log('Added to cart')}
                        className="flex items-center gap-2 bg-black text-white uppercase text-sm tracking-widest px-6 py-3 hover:scale-[1.02] transition-transform"
                    >
                        <CartIcon size={18} /> Add to Cart
                    </button>

                    <button
                        onClick={() => setLiked(!liked)}
                        className={`border border-black p-2 rounded hover:scale-[1.1] transition-transform ${liked ? 'bg-black text-white' : ''
                            }`}
                    >
                        <HeartIcon size={18} />
                    </button>
                </div>

                {/* DESCRIPTION */}
                <div className="text-sm md:text-base text-gray-700 leading-relaxed">
                    <p className="uppercase opacity-50 tracking-wide mb-2">Description</p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                        bibendum ex eu sapien fermentum, ut ultricies enim faucibus. Sed
                        vehicula, nisl sed ullamcorper sodales, urna purus dapibus ex, nec
                        commodo velit libero nec justo.
                    </p>
                </div>

                {/* BACK BUTTON */}
                <button
                    onClick={() => router.back()}
                    className="mt-12 text-xs uppercase tracking-wide opacity-40 hover:opacity-80 transition"
                >
                    Back
                </button>
            </div>
        </div>
    )
}
