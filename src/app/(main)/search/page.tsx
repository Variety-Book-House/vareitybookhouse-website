'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import ItemCard, { Book } from '@/components/ItemCard'

/* TEMP MOCK DATA – replace with real search later */
const mockBooks: Book[] = [
    {
        id: '1',
        volumeInfo: { title: 'Atomic Habits', authors: ['James Clear'] },
        saleInfo: { listPrice: { amount: 399 } },
    },
    {
        id: '2',
        volumeInfo: { title: 'Deep Work', authors: ['Cal Newport'] },
        saleInfo: { listPrice: { amount: 349 } },
    },
    {
        id: '3',
        volumeInfo: { title: 'Ikigai', authors: ['Héctor García'] },
        saleInfo: { listPrice: { amount: 299 } },
    },
]

export default function SearchPage() {
    const inputRef = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState('')

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    // ✅ SHOW ALL BY DEFAULT, FILTER WHEN TYPING
    const results =
        query.length === 0
            ? mockBooks
            : mockBooks.filter(book =>
                book.volumeInfo?.title
                    ?.toLowerCase()
                    .includes(query.toLowerCase())
            )

    return (
        <div className="bg-white h-screen overflow-y-auto">
            {/* TOP BAR */}
            <div className="flex items-center justify-between px-6 py-6 md:px-12">
                <span className="font-main text-sm tracking-widest uppercase">
                    Search
                </span>

                <Link href="/" aria-label="Close search">
                    <X className="h-6 w-6 stroke-[1.2]" />
                </Link>
            </div>

            {/* SEARCH INPUT */}
            <div className="px-6 md:px-12">
                <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search books"
                    className="
            w-full
            bg-transparent
            border-b border-black
            pb-4
            text-[clamp(1.8rem,4vw,3rem)]
            font-light
            tracking-wide
            outline-none
            placeholder:text-black/30
          "
                />
            </div>

            {/* RESULTS */}
            <div className="mt-12 px-6 md:px-12 pb-20">
                {results.length === 0 && (
                    <p className="font-MyFont text-sm opacity-50">
                        No results found
                    </p>
                )}

                {results.length > 0 && (
                    <div
                        className="
              grid
              grid-cols-2
              gap-x-4 gap-y-10
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
            "
                    >
                        {results.map(book => (
                            <ItemCard
                                key={book.id}
                                book={book}
                                show
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
