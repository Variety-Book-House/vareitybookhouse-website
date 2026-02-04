'use client'

import React, { useRef, useState, useEffect } from 'react'
import ItemCard from '@/components/ItemCard'
import { Product } from '@/lib/definitions'
interface LanguageCarouselProps {
    languages: string[]
    books: Product[]
    loading?: boolean
    onActiveChange?: (language: string) => void
}


const SLIDE_HEIGHT = 36
const SLIDE_GAP = 8 // gap-2 = 0.5rem = 8px
const SLIDE_STEP = SLIDE_HEIGHT + SLIDE_GAP


const LanguageCarousel = ({
    languages,
    books,
    loading = false,
    onActiveChange,
}: LanguageCarouselProps) => {

    const langRef = useRef<HTMLDivElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    useEffect(() => {
        if (onActiveChange) {
            onActiveChange(languages[activeIndex])
        }
    }, [activeIndex])
    useEffect(() => {
        const container = langRef.current
        if (!container) return

        let rafId: number | null = null

        const handler = () => {
            if (rafId) return

            rafId = requestAnimationFrame(() => {
                rafId = null

                const isMobile = window.innerWidth < 768
                const containerRect = container.getBoundingClientRect()

                const center = isMobile
                    ? containerRect.left + containerRect.width / 2
                    : containerRect.top + containerRect.height / 2

                let closestIndex = 0
                let minDist = Infinity

                Array.from(container.children).forEach((child, index) => {
                    const rect = (child as HTMLElement).getBoundingClientRect()
                    const elCenter = isMobile
                        ? rect.left + rect.width / 2
                        : rect.top + rect.height / 2

                    const dist = Math.abs(center - elCenter)
                    if (dist < minDist) {
                        minDist = dist
                        closestIndex = index
                    }
                })

                setActiveIndex(closestIndex)
            })
        }


        handler()
        container.addEventListener('scroll', handler, { passive: true })

        return () => container.removeEventListener('scroll', handler)
    }, [])
    const getSlideStep = () => {
        const el = langRef.current?.children[0] as HTMLElement | undefined
        if (!el) return SLIDE_STEP

        const style = window.getComputedStyle(el)
        const gap = parseFloat(style.marginBottom || '0')

        return el.offsetHeight + gap
    }



    const scrollBySlide = (dir: 'up' | 'down') => {
        if (!langRef.current) return

        const isMobile = window.innerWidth < 768
        const step = getSlideStep()

        langRef.current.scrollBy({
            top: !isMobile ? (dir === 'down' ? step : -step) : 0,
            left: isMobile ? (dir === 'down' ? step : -step) : 0,
            behavior: 'smooth',
        })
    }


    const scrollByCard = (dir: 'left' | 'right') => {
        if (!cardRef.current) return

        const card = cardRef.current.firstElementChild as HTMLElement
        const cardWidth = card?.offsetWidth ?? 260
        const gap = 16
        cardRef.current.scrollBy({
            left:
                dir === 'right'
                    ? cardWidth + gap
                    : -(cardWidth + gap),
            behavior: 'smooth',
        })
    }

    return (
        <div className="w-full h-full gap-3 flex flex-col md:flex-row md:items-center justify-center gap-[clamp(1rem, 2vh,5rem)] px-6 py-[clamp(1rem,2vh,5rem)]">
            <div className=' relative flex flex-col justify-center'>
                {/* UP */}
                <button
                    onClick={() => scrollBySlide('up')}
                    className="hidden md:block   text-lg opacity-60 hover:opacity-100"
                >
                    ↑
                </button>
                {/* LANGUAGE COLUMN */}
                <div className="relative self-center w-[220px] h-auto flex-shrink-0">

                    <div
                        ref={langRef}
                        className="
    flex
    md:flex-col
    gap-2

    px-[calc(50%-50px)] md:px-0
    py-0 md:py-[calc(100px-18px)]

    overflow-x-auto md:overflow-y-auto
    overflow-y-hidden md:overflow-x-hidden

    snap-x md:snap-y
    snap-mandatory

    scrollbar-hide
    overscroll-x-contain
    touch-pan-x

    h-auto md:h-[216px]
    w-full md:w-[220px]

    scroll-smooth
  "
                    >


                        {languages.map((lang, index) => {
                            const isActive = index === activeIndex

                            return (
                                <div
                                    onClick={() => {
                                        const el = langRef.current?.children[index] as HTMLElement
                                        el?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'center',
                                            inline: 'center',
                                        })
                                    }}

                                    key={lang}
                                    className={`
                snap-center
                shrink-0

                w-[140px] md:w-auto
                h-[50px] md:h-[36px]

                flex items-center justify-center
                text-lg md:text-lg
                uppercase tracking-widest
                font-extralight
                border cursor-pointer
                transition-all duration-300 ease-out
text-[14px] md:text-[18px]
                ${isActive
                                            ? 'bg-white border-black text-black z-10'
                                            : 'bg-white text-black opacity-60 hover:opacity-100'}
            `}
                                >
                                    {lang}
                                </div>
                            )
                        })}


                    </div>



                </div>


                {/* DOWN */}
                <button
                    onClick={() => scrollBySlide('down')}
                    className="hidden md:block  text-lg opacity-60 hover:opacity-100"
                >
                    ↓
                </button>
            </div>
            <div className="
  my-[2vh] md:my-0
  h-px md:h-[90%]
  w-full md:w-px
  bg-black/20
  self-stretch
  self-center
" />
            {/* BOOK CAROUSEL */}
            <div className="flex-1 md:justify-center flex flex-col gap-4 overflow-hidden">
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
                <div
                    ref={cardRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth min-h-[320px]"
                >
                    {loading ? (
                        <div className="flex w-full h-[320px] items-center justify-center">
                            <div className="h-10 w-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        books.map((book) => (
                            <div key={book.id} className="shrink-0">
                                <ItemCard book={book} show={true} />
                            </div>
                        ))
                    )}
                </div>





                <button className="group self-center relative hover:bg-black p-[0.5rem] transition:ease hover:text-white w-fit border-[1px] border-black inline-block text-sm uppercase tracking-widest text-black mt-4 overflow-visible">


                    Explore

                </button>




            </div>
        </div>

    )
}

export default LanguageCarousel
