'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingBag } from 'lucide-react'

const wishlistItems = [
    {
        id: '1',
        title: 'Atomic Habits',
        author: 'James Clear',
        price: 399,
        image: '/image 14.png',
    },
    {
        id: '2',
        title: 'Deep Work',
        author: 'Cal Newport',
        price: 349,
        image: '/image 14.png',
    },
    {
        id: '3',
        title: 'Ikigai',
        author: 'Héctor García',
        price: 299,
        image: '/image 14.png',
    },
]

export default function WishlistPage() {
    return (
        <div className="bg-white min-h-screen pt-[var(--navbar-h)] px-6 md:px-12">

            {/* TITLE */}
            <h1 className="font-MyFont font-extralight text-[clamp(1.5rem,3vw,5rem)] mb-16">
                WISHLIST
            </h1>

            {/* GRID */}
            <div
                className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          gap-x-6
          gap-y-16
        "
            >
                {wishlistItems.map(item => (
                    <div key={item.id} className="group relative">

                        {/* IMAGE */}
                        <div className="relative aspect-[3/4] w-full">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* HOVER INFO */}
                        <div
                            className="
                absolute inset-0
                bg-white/90
                opacity-0
                group-hover:opacity-100
                transition
                flex flex-col
                justify-between
                p-4
              "
                        >
                            <div>
                                <p className="text-sm font-MyFont">
                                    {item.title}
                                </p>
                                <p className="text-xs opacity-50 mt-1">
                                    {item.author}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-sm">
                                    ₹{item.price}
                                </p>

                                <div className="flex gap-4">
                                    <button className="opacity-40 hover:opacity-100 transition">
                                        <ShoppingBag size={16} />
                                    </button>
                                    <button className="opacity-40 hover:opacity-100 transition">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* EMPTY STATE */}
            {wishlistItems.length === 0 && (
                <div className="mt-32 text-center">
                    <p className="text-sm opacity-50 tracking-wide">
                        Your wishlist is empty
                    </p>
                    <Link
                        href="/books"
                        className="inline-block mt-6 text-xs uppercase tracking-widest underline underline-offset-4"
                    >
                        Discover books
                    </Link>
                </div>
            )}
        </div>
    )
}
