'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'

const cartItems = [
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
]

export default function CartPage() {
    const subtotal = cartItems.reduce((s, i) => s + i.price, 0)

    return (
        <div className="bg-white min-h-screen pt-[var(--navbar-h)] px-6 md:px-12">

            {/* PAGE TITLE */}
            <h1 className="font-MyFont font-extralight text-[clamp(1.5rem,3vw,5rem)] mb-16">
                SHOPPING BAG
            </h1>

            <div className="flex flex-col lg:flex-row gap-20">

                {/* LEFT – ITEMS */}
                <div className="flex-1">
                    {cartItems.map(item => (
                        <div
                            key={item.id}
                            className="flex gap-6 py-10 border-b border-black/10"
                        >
                            {/* IMAGE */}
                            <div className="w-[90px] h-[130px] relative">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* INFO */}
                            <div className="flex-1">
                                <p className="font-MyFont text-sm tracking-wide">
                                    {item.title}
                                </p>
                                <p className="text-xs opacity-50 mt-1">
                                    {item.author}
                                </p>

                                <p className="mt-6 text-sm">
                                    ₹{item.price}
                                </p>
                            </div>

                            {/* REMOVE */}
                            <button className="self-start opacity-40 hover:opacity-100 transition">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* RIGHT – SUMMARY */}
                <div className="w-full lg:w-[320px]">
                    <div className="sticky top-[calc(var(--navbar-h)+2rem)]">

                        <p className="text-xs uppercase tracking-widest opacity-50 mb-8">
                            Order Summary
                        </p>

                        <div className="flex justify-between text-sm mb-4">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>

                        <div className="flex justify-between text-sm mb-8">
                            <span>Shipping</span>
                            <span className="opacity-50">Calculated at checkout</span>
                        </div>

                        <div className="flex justify-between text-lg font-light border-t border-black/10 pt-6 mb-10">
                            <span>Total</span>
                            <span>₹{subtotal}</span>
                        </div>

                        {/* CHECKOUT */}
                        <button
                            className="
                w-full
                py-4
                bg-black
                text-white
                text-sm
                tracking-widest
                uppercase
                hover:bg-black/90
                transition
              "
                        >
                            Proceed to Checkout
                        </button>

                        {/* CONTINUE */}
                        <Link
                            href="/search"
                            className="
                block
                text-center
                text-xs
                tracking-wide
                uppercase
                opacity-50
                hover:opacity-100
                transition
                mt-6
              "
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
