'use client'
import { useCallback, useEffect, useState } from 'react'
import type { EmblaCarouselType } from 'embla-carousel'
import type { ButtonHTMLAttributes } from 'react'

/* ---------- Hook ---------- */
export function useDotButton(
    emblaApi?: EmblaCarouselType,
    onButtonClick?: (api: EmblaCarouselType) => void
) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

    const scrollTo = useCallback(
        (index: number) => {
            if (!emblaApi) return
            emblaApi.scrollTo(index)
            onButtonClick?.(emblaApi)
        },
        [emblaApi, onButtonClick]
    )

    const onInit = useCallback((api: EmblaCarouselType) => {
        setScrollSnaps(api.scrollSnapList())
    }, [])

    const onSelect = useCallback((api: EmblaCarouselType) => {
        setSelectedIndex(api.selectedScrollSnap())
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        onInit(emblaApi)
        onSelect(emblaApi)

        emblaApi
            .on('reInit', onInit)
            .on('reInit', onSelect)
            .on('select', onSelect)
    }, [emblaApi, onInit, onSelect])

    return {
        selectedIndex,
        scrollSnaps,
        scrollTo
    }
}

/* ---------- Component ---------- */
type DotButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean
}

export function DotButton({
    active,
    className = '',
    ...props
}: DotButtonProps) {
    return (
        <button
            type="button"
            className={`w-10 h-10 flex items-center justify-center ${className}`}
            {...props}
        >
            <span
                className={`w-3.5 h-3.5 rounded-full border-2 transition-colors
          ${active ? 'border-black bg-black' : 'border-gray-400'}
        `}
            />
        </button>
    )
}
