'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import {
    EmblaCarouselType,
    EmblaEventType,
    EmblaOptionsType
} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'

import { NextButton, PrevButton, usePrevNextButtons } from './Arrowbutton'
import { useDotButton } from './Dotbutton'

const TWEEN_FACTOR_BASE = 0.9

const clamp = (n: number, min: number, max: number) =>
    Math.min(Math.max(n, min), max)

export interface Book {
    id: string
    volumeInfo: {
        title: string
        authors: string[]
        imageLinks: {
            thumbnail: string
        }
    }
    saleInfo: {
        listPrice?: {
            amount: number
        }
    }
}

type PropType = {
    books: Book[]
    options?: EmblaOptionsType
}

const EmblaCarouselOpacity: React.FC<PropType> = ({ books, options }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        ...options
    })

    const tweenFactor = useRef(0)
    const { selectedIndex } = useDotButton(emblaApi)
    const { prevBtnDisabled, onPrevButtonClick, onNextButtonClick } =
        usePrevNextButtons(emblaApi)

    const setTweenFactor = useCallback((api: EmblaCarouselType) => {
        tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length
    }, [])

    const tweenOpacity = useCallback(
        (api: EmblaCarouselType, eventName?: EmblaEventType) => {
            const engine = api.internalEngine()
            const scrollProgress = api.scrollProgress()
            const slidesInView = api.slidesInView()
            const isScroll = eventName === 'scroll'

            api.scrollSnapList().forEach((snap, snapIndex) => {
                let diff = snap - scrollProgress
                const slidesInSnap = engine.slideRegistry[snapIndex]

                slidesInSnap.forEach((slideIndex) => {
                    if (isScroll && !slidesInView.includes(slideIndex)) return

                    if (engine.options.loop) {
                        engine.slideLooper.loopPoints.forEach((loopItem) => {
                            if (slideIndex === loopItem.index && loopItem.target() !== 0) {
                                diff =
                                    loopItem.target() < 0
                                        ? snap - (1 + scrollProgress)
                                        : snap + (1 - scrollProgress)
                            }
                        })
                    }

                    const tween = 1 - Math.abs(diff * tweenFactor.current)
                    const opacity = clamp(tween, 0.4, 1)
                    const scale = clamp(0.92 + tween * 0.08, 0.92, 1)

                    const slide = api.slideNodes()[slideIndex]
                    slide.style.opacity = opacity.toString()
                    slide.style.transform = `scale(${scale})`
                })
            })
        },
        []
    )

    useEffect(() => {
        if (!emblaApi) return
        setTweenFactor(emblaApi)
        tweenOpacity(emblaApi)

        emblaApi
            .on('reInit', setTweenFactor)
            .on('reInit', tweenOpacity)
            .on('scroll', tweenOpacity)
            .on('slideFocus', tweenOpacity)
    }, [emblaApi, tweenOpacity, setTweenFactor])

    const activeBook = books[selectedIndex]

    return (
        <section className="relative overflow-hidden h-full bg-[#F5F1EB]">
            {/* CONTENT */}
            <div
                className="
          h-full
          relative z-10
          flex flex-col gap-5 md:gap-10
          px-4 py-4
          md:grid md:grid-cols-[3fr_1px_2fr]
          md:items-center
          md:px-6 md:py-6
        "
            >
                <h2>BEST SELLER</h2>

                {/* CAROUSEL */}
                <div
                    ref={emblaRef}
                    className="h-full relative w-full overflow-hidden group"
                >
                    <div className="flex -ml-3 md:-ml-6 h-full">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="flex-[0_0_80%] md:flex-[0_0_42%] pl-3 md:pl-6"
                            >
                                <div className="flex justify-center items-center h-full py-2 md:py-0">
                                    <img
                                        src="/image 14.png"
                                        alt={book.volumeInfo.title}
                                        className="
                      h-full w-auto object-contain
                      select-none pointer-events-none
                    "
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Arrows */}
                    <PrevButton
                        onClick={onPrevButtonClick}
                        disabled={prevBtnDisabled}
                        className="
              absolute top-1/2 left-2 -translate-y-1/2
              opacity-40 hover:opacity-70
              transition-opacity
            "
                    />
                    <NextButton
                        onClick={onNextButtonClick}
                        className="
              absolute top-1/2 right-2 -translate-y-1/2
              opacity-40 hover:opacity-70
              transition-opacity
            "
                    />
                </div>

                {/* DIVIDER */}
                <div className="hidden md:block w-px h-[60%] bg-black mx-auto" />
                <div className="block md:hidden w-[60%] h-px bg-black mx-auto" />

                {/* INFO PANEL */}
                {activeBook && (
                    <div className="flex flex-col justify-center gap-4 md:gap-6 text-black">
                        <h2
                            className="
                font-MyFont
                text-[22px] md:text-[40px]
                uppercase
                font-light
              "
                        >
                            {activeBook.volumeInfo.title}
                        </h2>

                        <p
                            className="
                font-MyFont
                text-sm md:text-base
                tracking-[0.25em]
                uppercase
              "
                        >
                            {activeBook.volumeInfo.authors?.join(', ')}
                        </p>

                        {activeBook.saleInfo.listPrice && (
                            <p
                                className="
                  font-MyFont
                  text-sm md:text-base
                  tracking-[0.2em]
                  mt-2 md:mt-4
                "
                            >
                                ₹ {activeBook.saleInfo.listPrice.amount}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

export default EmblaCarouselOpacity
