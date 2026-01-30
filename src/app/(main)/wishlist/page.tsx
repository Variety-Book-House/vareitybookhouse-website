'use client'

import Link from 'next/link'
import ItemCard, { Book } from '@/components/ItemCard'
import { Share2 } from 'lucide-react'
import { useState } from 'react'

const initialWishlist: Book[] = [
    {
        id: '1',
        volumeInfo: {
            title: 'Atomic Habits',
            authors: ['James Clear'],
            imageLinks: { thumbnail: '/image 14.png' },
        },
        saleInfo: {
            listPrice: { amount: 399 },
        },
    },
    {
        id: '2',
        volumeInfo: {
            title: 'Deep Work',
            authors: ['Cal Newport'],
            imageLinks: { thumbnail: '/image 14.png' },
        },
        saleInfo: {
            listPrice: { amount: 349 },
        },
    },
    {
        id: '3',
        volumeInfo: {
            title: 'Ikigai',
            authors: ['Héctor García'],
            imageLinks: { thumbnail: '/image 14.png' },
        },
        saleInfo: {
            listPrice: { amount: 299 },
        },
    },
]

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<Book[]>(initialWishlist)
    const [isPublic, setIsPublic] = useState(false)

    const handleShare = () => {
        const shareData = {
            title: 'My Wishlist',
            text: 'Check out my wishlist!',
            url: window.location.href,
        }
        if (navigator.share) {
            navigator.share(shareData)
        } else {
            alert('Share not supported on this browser.')
        }
    }

    const removeFromWishlist = (id: string) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id))
    }

    return (
        <div className="bg-white min-h-screen pt-[var(--navbar-h)] px-6 md:px-12">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-16">
                <h1 className="font-MyFont font-extralight text-[clamp(1.5rem,1vw,5rem)]">
                    WISHLIST
                </h1>

                <div className="flex items-center gap-4">
                    {/* Private / Public toggle */}
                    <button
                        onClick={() => setIsPublic(!isPublic)}
                        className={`px-3 py-1 rounded-lg text-xs uppercase tracking-wide transition
                        ${isPublic ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}`}
                    >
                        {isPublic ? 'Public' : 'Private'}
                    </button>

                    {/* Share button */}
                    <button
                        onClick={handleShare}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                        title="Share Wishlist"
                    >
                        <Share2 size={16} />
                    </button>
                </div>
            </div>

            {/* GRID */}
            {wishlistItems.length > 0 ? (
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
                    {wishlistItems.map(book => (
                        <ItemCard
                            key={book.id}
                            book={book}
                            showDelete
                            onDelete={(id) => removeFromWishlist(id)}
                        />
                    ))}
                </div>
            ) : (
                /* EMPTY STATE */
                <div className="mt-32 text-center">
                    <p className="text-sm opacity-50 tracking-wide">
                        Your wishlist is empty
                    </p>
                    <Link
                        href="/search"
                        className="inline-block mt-6 text-xs uppercase tracking-widest underline underline-offset-4"
                    >
                        Discover books
                    </Link>
                </div>
            )}
        </div>
    )
}
