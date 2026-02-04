'use client'

import Link from 'next/link'
import ItemCard from '@/components/ItemCard'
import { Share2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/definitions'
export default function WishlistPage() {
    const router = useRouter()
    const [wishlistItems, setWishlistItems] = useState<Product[]>([])
    const [isPublic, setIsPublic] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false)

    useEffect(() => {
        fetchWishlist()
    }, [])

    const fetchWishlist = async () => {
        try {
            const response = await fetch('/api/wishlist')

            if (response.status === 401) {
                router.push('/login')
                return
            }

            if (!response.ok) {
                throw new Error('Failed to fetch wishlist')
            }

            const data = await response.json()

            // Transform database items to Book format
            const products: Product[] = data.items
            setWishlistItems(products)
            setIsPublic(data.isPublic)


        } catch (error) {
            console.error('Error fetching wishlist:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleShare = () => {
        const shareData = {
            title: 'My Wishlist',
            text: 'Check out my wishlist!',
            url: window.location.href,
        }
        if (navigator.share) {
            navigator.share(shareData)
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
        }
    }

    const toggleVisibility = async () => {
        setIsUpdatingVisibility(true)

        try {
            const response = await fetch('/api/wishlist/visibility', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublic: !isPublic }),
            })

            if (response.ok) {
                setIsPublic(!isPublic)
            } else {
                console.error('Failed to update visibility')
            }
        } catch (error) {
            console.error('Error updating visibility:', error)
        } finally {
            setIsUpdatingVisibility(false)
        }
    }

    const removeFromWishlist = async (id: string) => {
        try {
            const response = await fetch('/api/wishlist/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: id }),
            })

            if (response.ok) {
                setWishlistItems(prev => prev.filter(item => item.id !== id))
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen pt-[var(--navbar-h)] px-6 md:px-12 flex items-center justify-center">
                <p className="text-sm opacity-50">Loading...</p>
            </div>
        )
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
                        onClick={toggleVisibility}
                        disabled={isUpdatingVisibility}
                        className={`px-3 py-1 rounded-lg text-xs uppercase tracking-wide transition
                        ${isPublic ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}
                        disabled:opacity-50`}
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