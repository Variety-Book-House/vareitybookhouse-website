'use client'

import React, { useEffect } from 'react'
import ItemCard from '@/components/ItemCard'
import type { Book } from '@/components/ItemCard'

interface ItemSlideProps {
    genre: string
    books: Book[]
}

/* ---------- helpers ---------- */

// Map genre -> Tailwind font-family


/* ---------- component ---------- */

const ItemSlide = ({ genre, books }: ItemSlideProps) => {


    // Optional: keep your color extraction if needed
    useEffect(() => {
        let cancelled = false
        const extractColors = async () => {
            await Promise.all(
                books.map(
                    (book) =>
                        new Promise<void>((resolve) => {
                            const src = book.volumeInfo?.imageLinks?.thumbnail
                            if (!src) return resolve()
                            const img = new Image()
                            img.crossOrigin = 'anonymous'
                            img.src = src
                            img.onerror = () => resolve()
                        })
                )
            )
        }
        extractColors()
        return () => {
            cancelled = true
        }
    }, [books])

    // Build background image path based on genre
    const bgImage = `/bg/${genre.toLowerCase()}.png`

    return (
        <div
            className="h-full px-5 py-1 flex flex-col overflow-hidden bg-cover bg-center"
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            <h2
                style={{
                    fontFamily:
                        genre.toLowerCase() === 'horror'
                            ? 'var(--font-horror)'
                            : genre.toLowerCase() === 'romance'
                                ? 'var(--font-romance)'
                                : genre.toLowerCase() === 'scifi'
                                    ? 'var(--font-scifi)'
                                    : genre.toLowerCase() === 'fantasy'
                                        ? 'var(--font-fantasy)'
                                        : 'var(--font-default)',
                }}
                className={`text-4xl text-center font-light tracking-wide pb-3`}
            >
                {genre.toUpperCase()}
            </h2>

            <div
                className="
          flex-1
          grid
          gap-10
          overflow-hidden
          justify-center
          place-content-start
          grid-cols-[repeat(auto-fit,260px)]
          sm:grid-cols-[repeat(auto-fit,260px)]
        "
            >
                {books.slice(0, 3).map((book) => (
                    <ItemCard
                        textSize="lg"
                        key={book.id}
                        book={book}
                        liked={[]}
                        setLiked={() => { }}
                        className="w-[240px] h-[360px]"
                    />
                ))}
            </div>
        </div>
    )
}

export default ItemSlide
