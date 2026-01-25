'use client'

import React, { useEffect, useState } from 'react'
import ItemCard from '@/components/ItemCard'
import type { Book } from '@/components/ItemCard'
import { CARD_CONFIG } from '@/lib/cardConfig'

interface ItemSlideProps {
    genre: string
    books: Book[]
}

type CardSize = 'sm' | 'md' | 'lg'

const TITLE_STYLES = {
    sm: { className: 'text-xl tracking-wide', padding: 'pb-2' },
    md: { className: 'text-3xl tracking-wider', padding: 'pb-3' },
    lg: { className: 'text-4xl tracking-[0.15em]', padding: 'pb-4' },
}

const GAP = 24

const getCardSize = (width: number): CardSize => {
    if (width < 640) return 'sm'
    if (width < 1024) return 'md'
    return 'lg'
}

const ItemSlide = ({ genre, books }: ItemSlideProps) => {
    const [cardSize, setCardSize] = useState<CardSize>('md')
    const [visibleCount, setVisibleCount] = useState(1)

    useEffect(() => {
        const updateLayout = () => {
            const screenW = window.innerWidth
            const screenH = window.innerHeight

            const size = getCardSize(screenW)
            setCardSize(size)

            const { width: cardW, height: cardH } = CARD_CONFIG[size]

            // space used by padding + title etc
            const usableWidth = screenW - 40
            const usableHeight = screenH - 160

            const cols = Math.max(
                1,
                Math.floor((usableWidth + GAP) / (cardW + GAP))
            )

            const rows = Math.max(
                1,
                Math.floor((usableHeight + GAP) / (cardH + GAP))
            )

            setVisibleCount(cols * rows)
        }

        updateLayout()
        window.addEventListener('resize', updateLayout)
        return () => window.removeEventListener('resize', updateLayout)
    }, [])

    return (
        <div className="w-full px-5 py-5 flex flex-col gap-2 overflow-hidden">
            <h2

                className={` text-Inter
          text-center font-light uppercase
          ${TITLE_STYLES[cardSize].className}
          ${TITLE_STYLES[cardSize].padding}
        `}
            >
                {genre}
            </h2>

            <div
                className="grid justify-center gap-6"
                style={{
                    gridTemplateColumns: `repeat(auto-fit, ${CARD_CONFIG[cardSize].width}px)`,
                }}
            >
                {books.slice(0, visibleCount).map((book) => (
                    <ItemCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    )
}

export default ItemSlide
