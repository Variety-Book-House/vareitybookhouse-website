'use client'

import React, { useEffect, useState } from 'react'
import ItemCard from '@/components/ItemCard'
import type { Book } from '@/components/ItemCard'

interface ItemSlideProps {
    genre: string
    books: Book[]
}

type CardSize = 'sm' | 'md' | 'lg'

const CARD_DIMENSIONS = {
    sm: { width: 160, height: 260 },
    md: { width: 200, height: 320 },
    lg: { width: 260, height: 420 },
}
const TITLE_STYLES = {
    sm: {
        className: 'text-xl tracking-wide',
        padding: 'pb-2',
    },
    md: {
        className: 'text-3xl tracking-wider',
        padding: 'pb-3',
    },
    lg: {
        className: 'text-4xl tracking-[0.15em]',
        padding: 'pb-4',
    },
}

const GAP = 24

const ItemSlide = ({ genre, books }: ItemSlideProps) => {
    const getCardSize = (width: number): CardSize => {
        if (width < 640) return 'sm'
        if (width < 1024) return 'md'
        return 'lg'
    }

    const [cardSize, setCardSize] = useState<CardSize>('md')
    const [visibleCount, setVisibleCount] = useState(3)

    useEffect(() => {
        const updateLayout = () => {
            const width = window.innerWidth
            const height = window.innerHeight

            const size = getCardSize(width)
            setCardSize(size)

            const { width: cardW, height: cardH } = CARD_DIMENSIONS[size]

            const containerWidth = width - 40
            const containerHeight = height - 200

            const cols =
                Math.floor((containerWidth + GAP) / (cardW + GAP)) || 1
            const rows =
                Math.floor((containerHeight + GAP) / (cardH + GAP)) || 1

            setVisibleCount(cols * rows)
        }

        updateLayout()
        window.addEventListener('resize', updateLayout)
        return () => window.removeEventListener('resize', updateLayout)
    }, [])

    return (
        <div
            className="w-full px-5 py-6 flex flex-col gap-6 bg-cover bg-center overflow-hidden"
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
                className={`
        text-center
        font-light
        uppercase
        ${TITLE_STYLES[cardSize].className}
        ${TITLE_STYLES[cardSize].padding}
    `}
            >
                {genre}
            </h2>


            <div
                className="grid justify-center gap-6"
                style={{
                    gridTemplateColumns: `repeat(auto-fit, ${CARD_DIMENSIONS[cardSize].width}px)`,
                }}
            >
                {books.slice(0, visibleCount).map((book) => (
                    <ItemCard
                        key={book.id}
                        book={book}
                        size={cardSize}
                        liked={[]}
                        setLiked={() => { }}
                    />
                ))}
            </div>
        </div>
    )
}

export default ItemSlide
