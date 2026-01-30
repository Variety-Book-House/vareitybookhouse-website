'use client'
import { useCardGrid } from '@/hooks/useCardGrid'
import { useEffect, useRef, useState } from 'react'
import { X, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import ItemCard, { Book } from '@/components/ItemCard'
import { FilterSection } from './FilterSection'
import { SortDropdown } from './SortTopDown'
import { Product, productToBook } from '@/lib/definitions'

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'title'

export default function SearchPage() {
    const { cardWidth, gap } = useCardGrid()
    const [minPrice, setMinPrice] = useState<number | ''>('')
    const [maxPrice, setMaxPrice] = useState<number | ''>('')

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [mobileSortOpen, setMobileSortOpen] = useState(false)
    const [sortBy, setSortBy] = useState<SortOption>('relevance')

    const inputRef = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [products, setProducts] = useState<Product[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [genres, setGenres] = useState<string[]>([])
    const getVisiblePages = (
        current: number,
        total: number,
        maxVisible = 5
    ) => {
        const pages: (number | '...')[] = []

        if (total <= maxVisible + 2) {
            return Array.from({ length: total }, (_, i) => i + 1)
        }

        pages.push(1)

        const start = Math.max(2, current - Math.floor(maxVisible / 2))
        const end = Math.min(total - 1, current + Math.floor(maxVisible / 2))

        if (start > 2) pages.push('...')

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        if (end < total - 1) pages.push('...')

        pages.push(total)

        return pages
    }
    const visiblePages = getVisiblePages(currentPage, totalPages, 5)

    // Fetch genres on mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await fetch('/api/genres')
                const data = await res.json()
                setGenres(data.genres || [])
            } catch (error) {
                console.error('Failed to fetch genres:', error)
            }
        }
        fetchGenres()
    }, [])

    // Fetch products when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams({
                    query,
                    sortBy,
                    page: currentPage.toString(),
                    limit: '8'
                })

                if (selectedCategory) {
                    params.append('genre', selectedCategory)
                }
                if (minPrice !== '') {
                    params.append('minPrice', minPrice.toString())
                }
                if (maxPrice !== '') {
                    params.append('maxPrice', maxPrice.toString())
                }

                const res = await fetch(`/api/products?${params.toString()}`)
                const data = await res.json()

                setProducts(data.products || [])
                setTotalPages(data.totalPages || 1)
            } catch (error) {
                console.error('Failed to fetch products:', error)
                setProducts([])
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [query, sortBy, selectedCategory, minPrice, maxPrice, currentPage])

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [query, sortBy, selectedCategory, minPrice, maxPrice])

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const [openSection, setOpenSection] = useState<'category' | 'price' | null>(null)

    // Convert products to Book format for ItemCard
    const books: Book[] = products.map(productToBook)

    return (
        <div className="bg-white flex pt-[var(--navbar-h)] flex-row min-h-screen">
            {/* SIDEBAR FILTERS - DESKTOP */}
            <div className="w-1/4 hidden md:block min-w-[220px] px-6 pt-10 font-MyFont">
                <div className="sticky top-[calc(var(--navbar-h)+2rem)]">
                    <h3 className="text-lg tracking-widest uppercase opacity-60 mb-5">
                        SORT BY
                    </h3>

                    <SortDropdown value={sortBy} onChange={setSortBy} />

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
                        {genres.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`text-left transition-opacity ${selectedCategory === cat
                                    ? 'opacity-100 underline underline-offset-4'
                                    : 'opacity-40 hover:opacity-80'
                                    }`}
                            >
                                {cat.toUpperCase()}
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
                                    className="bg-transparent border-b border-black/40 pb-1 text-sm tracking-wide uppercase outline-none placeholder:opacity-30 focus:border-black transition-all focus:scale-[1.02] origin-left"
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
                                        setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))
                                    }
                                    placeholder="1000"
                                    className="bg-transparent border-b border-black/40 pb-1 text-sm tracking-wide uppercase outline-none placeholder:opacity-30 focus:border-black transition-all focus:scale-[1.02] origin-left"
                                />
                            </div>
                        </div>
                    </FilterSection>

                    {/* CLEAR */}
                    {(selectedCategory || maxPrice || minPrice) && (
                        <button
                            onClick={() => {
                                setSelectedCategory(null)
                                setMaxPrice('')
                                setMinPrice('')
                            }}
                            className="mt-12 text-xs uppercase tracking-wide opacity-40 hover:opacity-80 transition"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex flex-col items-center w-full">
                {/* SEARCH INPUT */}
                <div className="px-6 py-2 md:px-12 w-[90%] md:w-[50%]">
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="WHAT ARE YOU LOOKING FOR?..."
                        className="w-full bg-transparent border-b border-black pb-4 text-[clamp(0.5rem,2vh,3rem)] font-light tracking-wide outline-none placeholder:text-black/30"
                    />

                    {/* MOBILE FILTER TOGGLE */}
                    <div className="md:hidden mt-4 flex justify-center gap-3 w-full">
                        <button
                            onClick={() => setMobileSortOpen(true)}
                            className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-60 hover:opacity-100 transition"
                        >
                            <ArrowUpDown size={16} strokeWidth={1.5} />
                            Sort
                        </button>

                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-60 hover:opacity-100 transition"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>
                </div>

                {/* MOBILE FILTERS MODAL */}
                {mobileFiltersOpen && (
                    <div className="fixed inset-0 z-50 bg-white md:hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h3 className="text-sm uppercase tracking-widest opacity-60">
                                Filters
                            </h3>
                            <button onClick={() => setMobileFiltersOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-8 space-y-10 overflow-y-auto">
                            <FilterSection
                                title="Category"
                                isOpen={openSection === 'category'}
                                onToggle={() =>
                                    setOpenSection(openSection === 'category' ? null : 'category')
                                }
                            >
                                {genres.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-left transition-opacity ${selectedCategory === cat
                                            ? 'opacity-100 underline underline-offset-4'
                                            : 'opacity-40 hover:opacity-80'
                                            }`}
                                    >
                                        {cat.toUpperCase()}
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
                                            className="bg-transparent border-b border-black/40 pb-1 text-sm tracking-wide uppercase outline-none placeholder:opacity-30 focus:border-black transition-all focus:scale-[1.02] origin-left"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs uppercase tracking-wide opacity-40">
                                            Max
                                        </label>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) =>
                                                setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))
                                            }
                                            placeholder="1000"
                                            className="bg-transparent border-b border-black/40 pb-1 text-sm tracking-wide uppercase outline-none placeholder:opacity-30 focus:border-black transition-all focus:scale-[1.02] origin-left"
                                        />
                                    </div>
                                </div>
                            </FilterSection>

                            {(selectedCategory || maxPrice || minPrice) && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null)
                                        setMaxPrice('')
                                        setMinPrice('')
                                    }}
                                    className="mt-12 text-xs uppercase tracking-wide opacity-40 hover:opacity-80 transition"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* MOBILE SORT MODAL */}
                {mobileSortOpen && (
                    <div className="fixed inset-0 z-50 bg-white md:hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h3 className="text-sm uppercase tracking-widest opacity-60">
                                SORT
                            </h3>
                            <button onClick={() => setMobileSortOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-8 space-y-10 overflow-y-auto">
                            <SortDropdown value={sortBy} onChange={setSortBy} />
                        </div>
                    </div>
                )}

                {/* RESULTS */}
                <div className="mt-12 w-full px-6 md:px-12 pb-20">
                    {loading && (
                        <p className="font-MyFont text-sm opacity-50">
                            Loading...
                        </p>
                    )}

                    {!loading && books.length === 0 && (
                        <p className="font-MyFont text-sm opacity-50">
                            No results found
                        </p>
                    )}

                    {!loading && books.length > 0 && (
                        <div
                            className="grid justify-center"
                            style={{
                                gridTemplateColumns: `repeat(auto-fit, ${cardWidth}px)`,
                                gap: `${gap}px`,
                            }}
                        >
                            {books.map(book => (
                                <ItemCard key={book.id} book={book} />
                            ))}
                        </div>
                    )}

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex gap-3 justify-center py-5 max-w-full overflow-hidden">
                            {visiblePages.map((page, i) =>
                                page === '...' ? (
                                    <span
                                        key={`dots-${i}`}
                                        className="text-xs opacity-40 select-none"
                                    >
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`text-xs uppercase tracking-wide transition ${currentPage === page
                                            ? 'opacity-100 underline underline-offset-4'
                                            : 'opacity-40 hover:opacity-80'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}
                        </div>

                    )}
                </div>
            </div>
        </div>
    )
}