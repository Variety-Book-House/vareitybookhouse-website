'use client';
import React, {
    ComponentPropsWithRef,
    useCallback,
    useEffect,
    useState
} from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type UsePrevNextButtonsType = {
    prevBtnDisabled: boolean
    nextBtnDisabled: boolean
    onPrevButtonClick: () => void
    onNextButtonClick: () => void
}

export const usePrevNextButtons = (
    emblaApi: EmblaCarouselType | undefined,
    onButtonClick?: (emblaApi: EmblaCarouselType) => void
): UsePrevNextButtonsType => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return
        emblaApi.scrollPrev()
        if (onButtonClick) onButtonClick(emblaApi)
    }, [emblaApi, onButtonClick])

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return
        emblaApi.scrollNext()
        if (onButtonClick) onButtonClick(emblaApi)
    }, [emblaApi, onButtonClick])

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        onSelect(emblaApi)
        emblaApi.on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onSelect])

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    }
}
type PropType = ComponentPropsWithRef<'button'>
const arrowButtonClasses = `
    h-full
  px-4
  rounded-lg




  flex items-center justify-center

  transition-all duration-300
    scale-80
  hover:scale-105
  active:scale-95

  disabled:opacity-40
  disabled:pointer-events-none
`
export const PrevButton: React.FC<PropType> = ({ className, ...props }) => {
    return (
        <button
            className={cn(arrowButtonClasses, className)}
            {...props}
        >
            <svg
                className="h-5 w-5 pointer-events-none"
                viewBox="0 0 532 532"
                fill="currentColor"
            >
                <path d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0L126.328 291.2a35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2L355.66 11.354Z" />
            </svg>
        </button>
    )
}

export const NextButton: React.FC<PropType> = ({ className, ...props }) => {
    return (
        <button

            className={cn(arrowButtonClasses, className)}
            {...props}
        >
            <svg
                className="h-5 w-5 pointer-events-none"
                viewBox="0 0 532 532"
                fill="currentColor"
            >
                <path d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0L405.674 240.8a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2L176.34 520.646Z" />
            </svg>
        </button>
    )
}
