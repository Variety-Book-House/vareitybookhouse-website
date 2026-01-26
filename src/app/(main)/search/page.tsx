'use client'
import { useCardGrid } from '@/hooks/useCardGrid'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { SlidersHorizontal } from 'lucide-react'
type SortOption = 'relevance' | 'price-low' | 'price-high' | 'title'

import ItemCard, { Book } from '@/components/ItemCard'
import { FilterSection } from './FilterSection'
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
    {
        id: '4',
        volumeInfo: { title: 'Ikigai', authors: ['Héctor García'] },
        saleInfo: { listPrice: { amount: 299 } },
    },
    {
        id: '5',
        volumeInfo: { title: 'Ikigai', authors: ['Héctor García'] },
        saleInfo: { listPrice: { amount: 299 } },
    },
    {
        id: '6',
        volumeInfo: { title: 'Ikigai', authors: ['Héctor García'] },
        saleInfo: { listPrice: { amount: 299 } },
    },
]

export default function SearchPage() {
    const { cardWidth, gap } = useCardGrid()
    const [minPrice, setMinPrice] = useState<number | ''>('')
    const [maxPrice, setMaxPrice] = useState<number | undefined>(0)
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [sortBy, setSortBy] = useState<SortOption>('relevance')

    const inputRef = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)



    const results = mockBooks
        .filter(book => {
            const titleMatch =
                query.length === 0 ||
                book.volumeInfo?.title
                    ?.toLowerCase()
                    .includes(query.toLowerCase())

            const priceMatch =
                !maxPrice ||
                (book.saleInfo?.listPrice?.amount ?? 0) <= maxPrice

            return titleMatch && priceMatch
        })
        .sort((a, b) => {
            const priceA = a.saleInfo?.listPrice?.amount ?? 0
            const priceB = b.saleInfo?.listPrice?.amount ?? 0
            const titleA = a.volumeInfo?.title ?? ''
            const titleB = b.volumeInfo?.title ?? ''

            switch (sortBy) {
                case 'price-low':
                    return priceA - priceB
                case 'price-high':
                    return priceB - priceA
                case 'title':
                    return titleA.localeCompare(titleB)
                default:
                    return 0
            }
        })


    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const [openSection, setOpenSection] = useState<
        'category' | 'price' | null
    >('category')

    return (
        <div className="bg-white flex pt-[var(--navbar-h)] flex-row h-screen overflow-y-auto">
            <div className="w-1/4 hidden md:block min-w-[220px] px-6 pt-10 font-MyFont">


                <div className="sticky top-[calc(var(--navbar-h)+2rem)]">
                    <h3 className="text-lg tracking-widest uppercase opacity-60 mb-5">
                        SORT BY
                    </h3>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="
      bg-transparent
      text-sm
      uppercase
      tracking-widest
      opacity-60
      hover:opacity-100
      transition
      outline-none
      cursor-pointer
    "
                    >
                        <option value="relevance">Relevance</option>
                        <option value="price-low">Price: Low → High</option>
                        <option value="price-high">Price: High → Low</option>
                        <option value="title">Title (A–Z)</option>
                    </select>
                    <h3 className="text-lg tracking-widest uppercase opacity-60 my-5">
                        Filters
                    </h3>

                    {/* CATEGORY */}
                    <FilterSection
                        title="Category"
                        isOpen={openSection === 'category'}
                        onToggle={() =>
                            setOpenSection(openSection === 'category' ? null : 'category')
                        }
                    >
                        {['SELF HELP', 'PRODUCTIVITY', 'PHILOSOPHY'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`text-left transition-opacity ${selectedCategory === cat
                                    ? 'opacity-100 underline underline-offset-4'
                                    : 'opacity-40 hover:opacity-80'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </FilterSection>

                    <FilterSection
                        title="Price"
                        isOpen={openSection === 'price'}
                        onToggle={() =>
                            setOpenSection(openSection === 'price' ? null : 'price')
                        }
                    >
                        <div className="flex flex-col gap-6">

                            {/* MIN */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs uppercase tracking-wide opacity-40">
                                    Min
                                </label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) =>
                                        setMinPrice(e.target.value === '' ? '' : Number(e.target.value))
                                    }
                                    placeholder="0"
                                    className="
                    bg-transparent
                    border-b border-black/40
                    pb-1
                    text-sm
                    tracking-wide
                    uppercase
                    outline-none
                    placeholder:opacity-30
                    focus:border-black
                    transition-all
                    focus:scale-[1.02]
                    origin-left
                "
                                />
                            </div>

                            {/* MAX */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs uppercase tracking-wide opacity-40">
                                    Max
                                </label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) =>
                                        setMaxPrice(e.target.value === undefined ? 0 : Number(e.target.value))
                                    }
                                    placeholder="1000"
                                    className="
                    bg-transparent
                    border-b border-black/40
                    pb-1
                    text-sm
                    tracking-wide
                    uppercase
                    outline-none
                    placeholder:opacity-30
                    focus:border-black
                    transition-all
                    focus:scale-[1.02]
                    origin-left
                "
                                />
                            </div>

                        </div>
                    </FilterSection>

                    {/* CLEAR */}
                    {(selectedCategory || maxPrice) && (
                        <button
                            onClick={() => {
                                setSelectedCategory(null)
                                setMaxPrice(0)
                            }}
                            className="mt-12 text-xs uppercase tracking-wide opacity-40 hover:opacity-80 transition"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

            </div>


            <div className="flex flex-col items-center w-full">.


                {/* SEARCH INPUT */}
                <div className="px-6 md:px-12 w-[50%]">
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="WHAT ARE YOU LOOKING FOR?..."
                        className="
           w-full
        
            bg-transparent
            border-b border-black
            pb-4
            text-[clamp(1rem,1vw,3rem)]
            font-light
            tracking-wide
            outline-none
            placeholder:text-black/30
          "
                    />
                    {/* MOBILE FILTER TOGGLE */}
                    <div className="md:hidden mt-6 flex justify-end gap-6 w-full px-6">
                        {/* SORT */}
                        <button
                            onClick={() => {
                                setSortBy(
                                    sortBy === 'price-low'
                                        ? 'price-high'
                                        : 'price-low'
                                )
                            }}
                            className="text-xs uppercase tracking-wide opacity-60 hover:opacity-100 transition"
                        >
                            Sort
                        </button>

                        {/* FILTER */}
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-60 hover:opacity-100 transition"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>


                </div>

                {mobileFiltersOpen && (
                    <div className="fixed inset-0 z-50 bg-white md:hidden">
                        {/* HEADER */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h3 className="text-sm uppercase tracking-widest opacity-60">
                                Filters
                            </h3>
                            <button onClick={() => setMobileFiltersOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* FILTER CONTENT */}
                        <div className="px-6 py-8 space-y-10 overflow-y-auto">
                            <FilterSection
                                title="Category"
                                isOpen
                                onToggle={() => { }}
                            >
                                {['SELF HELP', 'PRODUCTIVITY', 'PHILOSOPHY'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-left block transition-opacity ${selectedCategory === cat
                                            ? 'opacity-100 underline underline-offset-4'
                                            : 'opacity-40'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </FilterSection>

                            <FilterSection
                                title="Price"
                                isOpen
                                onToggle={() => { }}
                            >
                                {/* reuse same price inputs */}
                                ...
                            </FilterSection>

                            {(selectedCategory || maxPrice) && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null)
                                        setMaxPrice(0)
                                    }}
                                    className="text-xs uppercase tracking-wide opacity-40"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {/* RESULTS */}
                <div className="mt-12 w-full px-6 md:px-12 pb-20">
                    {results.length === 0 && (
                        <p className="font-MyFont text-sm opacity-50">
                            No results found
                        </p>
                    )}

                    {results.length > 0 && (
                        <div
                            className="grid justify-center"
                            style={{
                                gridTemplateColumns: `repeat(auto-fit, ${cardWidth}px)`,
                                gap: `${gap}px`,
                            }}
                        >
                            {results.map(book => (
                                <ItemCard
                                    key={book.id}
                                    book={book}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
