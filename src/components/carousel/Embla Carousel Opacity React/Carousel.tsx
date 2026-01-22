'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    EmblaCarouselType,
    EmblaEventType,
    EmblaOptionsType
} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'

import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './Arrowbutton'
import { DotButton, useDotButton } from './Dotbutton'
import ItemCard from '../../ItemCard'

const TWEEN_FACTOR_BASE = 0.84

const clamp = (n: number, min: number, max: number) =>
    Math.min(Math.max(n, min), max)

/* ✅ STRICT Book TYPE */
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
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const tweenFactor = useRef(0)
    const image = '/image 14.png'

    const imgRef = useRef<HTMLImageElement | null>(null)
    const [bgColor, setBgColor] = useState('rgb(20,20,20)')
    const [liked, setLiked] = useState<string[]>([])

    const { selectedIndex, scrollSnaps, scrollTo } = useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const setTweenFactor = useCallback((api: EmblaCarouselType) => {
        tweenFactor.current =
            TWEEN_FACTOR_BASE * api.scrollSnapList().length
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
                            if (
                                slideIndex === loopItem.index &&
                                loopItem.target() !== 0
                            ) {
                                diff =
                                    loopItem.target() < 0
                                        ? snap - (1 + scrollProgress)
                                        : snap + (1 - scrollProgress)
                            }
                        })
                    }

                    const tween = 1 - Math.abs(diff * tweenFactor.current)
                    api.slideNodes()[slideIndex].style.opacity =
                        clamp(tween, 0.3, 1).toString()
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

    return (
        <div className="grid grid-cols-[3fr_2fr] gap-5  h-fit overflow-hidden m-5">



            {/* Carousel */}
            <div className=" relative h-fit group w-full overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y -ml-4 align-center justify-between">
                    {books.map((book, index) => (
                        <div
                            key={book.id}
                            className="flex-[0_0_35%]"
                        >
                            <div
                                className={` flex justify-center transition-transform duration-300 ease-out ${index === selectedIndex
                                    ? 'scale-100'
                                    : 'scale-60'
                                    }`}
                            >
                                <img
                                    ref={imgRef}
                                    src={image}

                                    crossOrigin="anonymous"
                                    className="w-full h-full object-fit"
                                    onError={(e) => (e.currentTarget.src = '/default.jpg')}
                                />
                            </div>
                        </div>
                    ))}





                </div>
                {/* Buttons */}
                <PrevButton
                    onClick={onPrevButtonClick}
                    disabled={prevBtnDisabled}
                    className="
    absolute top-1/2 left-2 -translate-y-1/2
    opacity-0 pointer-events-none
    group-hover:opacity-100 group-hover:pointer-events-auto
    transition-opacity duration-300
    bg-transparent hover:bg-transparent
    text-gray-800 disabled:text-gray-400
  "
                />

                <NextButton
                    onClick={onNextButtonClick}
                    disabled={false}
                    className="
    absolute top-1/2 right-2 -translate-y-1/2
    opacity-0 pointer-events-none
    group-hover:opacity-100 group-hover:pointer-events-auto
    transition-opacity duration-300
    bg-transparent hover:bg-transparent
    text-gray-800 disabled:text-gray-400
  "
                />

            </div>

            <div className="w-full">
                <h2 className="text-5xl font-light">TITLE</h2>
                <p className="text-3xl text-wrap font-light text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias iure nesciunt illo, sunt porro doloribus delectus unde obcaecati, possimus quaerat tempore labore sapiente in ad sint impedit, facere iste voluptas.
                </p>
            </div>


        </div>
    )
}

export default EmblaCarouselOpacity
