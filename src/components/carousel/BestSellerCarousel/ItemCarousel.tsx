'use client'
import React, { useRef, useState, useEffect } from 'react'

import ItemCard from '@/components/ItemCard'
import { Product } from '@/lib/definitions'
interface ItemCarouselProps {
    title: string
    books: Product[]
}

const ItemCarousel = ({ title, books }: ItemCarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [progress, setProgress] = useState(0)
    const [showSeeMore, setShowSeeMore] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [tallScreen, setTallScreen] = useState(false)

    useEffect(() => {
        const checkHeight = () => {
            setTallScreen(window.innerHeight > 500)
        }

        checkHeight()
        window.addEventListener('resize', checkHeight)

        return () => window.removeEventListener('resize', checkHeight)
    }, [])

    const seeMoreRef = useRef<HTMLSpanElement>(null)
    const [underlineWidth, setUnderlineWidth] = useState(0)
    useEffect(() => {
        if (showSeeMore && seeMoreRef.current) {
            setUnderlineWidth(seeMoreRef.current.offsetWidth - 2)
        }
    }, [showSeeMore])
    useEffect(() => {
        if (progress >= 99 && !isComplete) {
            setIsComplete(true)

            setTimeout(() => {
                setShowSeeMore(true)
            }, 300)
        }
    }, [progress, isComplete])



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
            left: dir === 'right' ? 2 * (cardWidth + gap) : 2 * (-(cardWidth + gap)),
            behavior: 'smooth',
        })

        // allow scroll to finish before recalculating
        requestAnimationFrame(updateProgress)
    }

    return (
        <div className="relative  w-full h-full flex flex-col px-10 py-[0rem] gap-[clamp(0rem,3vh,5rem)]">
            {/* TITLE */}  {/* Overlay – LOWER transparency */}

            <div className='flex flex-row'>
                <h2
                    className="
    text-[clamp(1.25rem,3vh,2.25rem)]
    md:text-[clamp(1.5rem,3.5vh,3rem)]
    font-Inter font-extralight whitespace-nowrap
    mb-[clamp(0rem,1vh,4rem)]
  "
                >
                    {title}
                </h2>

                <div className="
  hidden
  md:flex
  items-center flex-row gap-2 justify-end w-full
    [@media(max-height:500px)]:hidden
">

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
                            show={tallScreen}
                        />
                    </div>

                ))}
            </div>

            {/* PROGRESS BAR */}
            {/* PROGRESS / UNDERLINE */}
            <div className="relative w-[70%] h-fit self-center m-[clamp(0.3rem,1.5vh,0.8rem)] h-6 flex justify-center">

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
    absolute bottom-[0px] left-1/2 h-fit
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
    px-4 py-1.5
    text-nowrap
    
    cursor-pointer
    font-Inter font-extralight
    tracking-widest uppercase
    hover:opacity-80
    md:text-lg text-lg
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
