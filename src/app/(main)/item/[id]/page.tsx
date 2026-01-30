'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { HeartIcon } from '@/components/icons/HeartIcon'
import { CartIcon } from '@/components/icons/CartIcon'
import { Product } from '@/lib/definitions'

export default function ItemDetailPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const id = params?.id

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [liked, setLiked] = useState(false)
    const [mainImage, setMainImage] = useState<string>('')
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    useEffect(() => {
        if (!id) return

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`)
                if (!res.ok) throw new Error('Product not found')

                const data = await res.json()
                setProduct(data)
                setMainImage(data.images?.[0] || '/image 14.png')
            } catch (error) {
                console.error('Failed to fetch product:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    const handleAddToCart = async () => {
        if (!product || isAddingToCart) return

        setIsAddingToCart(true)

        try {
            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    quantity,
                }),
            })

            if (res.ok) {
                alert('Added to cart')
            } else if (res.status === 401) {
                router.push('/login')
            } else {
                alert('Failed to add to cart')
            }
        } catch {
            alert('Something went wrong')
        } finally {
            setIsAddingToCart(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        )
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Product not found
            </div>
        )
    }

    const thumbnails = product.images?.length
        ? product.images
        : ['/image 14.png']

    const isOutOfStock = product.stock === 0

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* IMAGE */}
            <div className="md:w-1/2 relative h-[70vh] md:h-screen bg-[#f5f5f5]">
                <Image
                    src={mainImage}
                    alt={product.title}
                    fill
                    className="object-contain"
                />
            </div>

            {/* INFO */}
            <div className="md:w-1/2 p-10">
                <p className="uppercase text-xs opacity-50">{product.genre}</p>
                <h1 className="text-4xl mb-2">{product.title}</h1>
                <p className="text-gray-600">{product.author}</p>

                <p className="text-2xl mt-4">₹{product.MRP}</p>

                <p className={`mt-2 ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                    {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
                </p>

                <div className="flex gap-4 mt-6">
                    <button
                        disabled={isOutOfStock || isAddingToCart}
                        onClick={handleAddToCart}
                        className="bg-black text-white px-6 py-3 disabled:bg-gray-400"
                    >
                        <CartIcon size={18} />{' '}
                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>

                    <button
                        onClick={() => setLiked(!liked)}
                        className="border p-3"
                    >
                        <HeartIcon size={18} />
                    </button>
                </div>

                <p className="mt-8">{product.description}</p>
            </div>
        </div>
    )
}
