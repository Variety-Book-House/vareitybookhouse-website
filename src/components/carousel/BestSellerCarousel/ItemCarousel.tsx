'use client'
import React, { useRef, useState, useEffect } from 'react'

import ItemCard, { Book } from '@/components/ItemCard'

interface ItemCarouselProps {
    title: string
    books: Book[]
}

const ItemCarousel = ({ title, books }: ItemCarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [progress, setProgress] = useState(0)
    const [showSeeMore, setShowSeeMore] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const seeMoreRef = useRef<HTMLSpanElement>(null)
    const [underlineWidth, setUnderlineWidth] = useState(0)
    useEffect(() => {
        if (showSeeMore && seeMoreRef.current) {
            setUnderlineWidth(seeMoreRef.current.offsetWidth)
        }
    }, [showSeeMore])
    useEffect(() => {
        if (progress >= 100 && !isComplete) {
            setIsComplete(true)

            // small pause before morphing → feels intentional
            setTimeout(() => {
                setShowSeeMore(true)
            }, 300)
        }
    }, [progress])


    const updateProgress = () => {
        if (!scrollRef.current) return

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const maxScroll = scrollWidth - clientWidth

        const percent =
            maxScroll > 0 ? Math.min(100, (scrollLeft / maxScroll) * 100) : 0
        if (percent < 100) {
            setIsComplete(false)
            setShowSeeMore(false)
        }

        setProgress(percent)
    }
    const scrollByCard = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return

        const card =
            scrollRef.current.firstElementChild as HTMLElement
        const cardWidth = card?.offsetWidth ?? 260
        const gap = 16

        scrollRef.current.scrollBy({
            left: dir === 'right' ? cardWidth + gap : -(cardWidth + gap),
            behavior: 'smooth',
        })

        // allow scroll to finish before recalculating
        requestAnimationFrame(updateProgress)
    }

    return (
        <div className="relative w-full h-full flex flex-col px-10 py-8 gap-10 md:gap-1" style={{ backgroundImage: "url('/BestSeller_bg.png')" }}>
            {/* TITLE */}  {/* Overlay – LOWER transparency */}

            <div className='flex flex-row'>
                <h2 className="text-3xl md:text-5xl font-Inter font-extralight mb-5  whitespace-nowrap">
                    {title}
                </h2>
                <div className="hidden items-center md:flex flex-row gap-2 justify-end w-full">
                    <button
                        onClick={() => scrollByCard('left')}
                        className="w-10 h-10 bg-white shadow-md
                   hover:bg-black hover:text-white transition"
                    >
                        ←
                    </button>

                    <button
                        onClick={() => scrollByCard('right')}
                        className="w-10 h-10 bg-white shadow-md
                   hover:bg-black hover:text-white transition"
                    >
                        →
                    </button>
                </div>
            </div>





            {/* CAROUSEL */}
            <div
                ref={scrollRef}
                onScroll={updateProgress}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth w-full"
            >

                {books.map((book) => (
                    <div key={book.id} className="shrink-0">
                        <ItemCard
                            book={book}
                            liked={[]}
                            setLiked={() => { }}
                            size={"xl"}
                        />
                    </div>
                ))}
            </div>

            {/* PROGRESS BAR */}
            {/* PROGRESS / UNDERLINE */}
            <div className="relative w-[70%] self-center mt-4 h-6 flex justify-center">

                {/* Bar */}
                <div
                    className="
        absolute bottom-0 h-[2px] bg-black
        transition-all duration-500 ease-in-out
    "
                    style={{
                        width: showSeeMore ? underlineWidth : `${progress}%`,
                        left: showSeeMore ? '50%' : 0,
                        transform: showSeeMore ? 'translateX(-50%)' : 'none',
                    }}
                />
                {/* Track (only visible while progressing) */}
                {!showSeeMore && (
                    <div className="absolute bottom-0 w-full h-[2px] bg-black/10" />
                )}

                {/* SEE MORE */}
                <span
                    className={`
        absolute bottom-0 left-1/2
        -translate-x-1/2
        transition-all duration-500 ease-out
        ${showSeeMore
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-2 pointer-events-none'}
    `}
                >
                    <span
                        ref={seeMoreRef}
                        className="
            inline-block
            cursor-pointer font-Inter font-extralight
            hover:opacity-80 md:text-3xl
            text-xl tracking-widest uppercase
        "
                    >
                        SEE MORE
                    </span>
                </span>


            </div>


        </div>
    )
}

export default ItemCarousel
