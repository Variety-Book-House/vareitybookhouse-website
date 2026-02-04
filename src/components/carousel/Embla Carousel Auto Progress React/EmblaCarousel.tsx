import React, { useRef } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

import { useAutoplayProgress } from './EmblaCarouselAutoplayProgress'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import ItemSlide from './ItemSlide'


import { Product } from '@/lib/definitions'
type PropType = {
  feed: {
    genre: string
    books: Product[]
  }[]
  options?: EmblaOptionsType
  loading?: boolean
}

const EmblaCarouselAutoplayProgress: React.FC<PropType> = ({
  feed,
  options,
  loading = false
}) => {
  const progressNode = useRef<HTMLDivElement>(null)

  // ⛔ Do NOT init Embla while loading or empty
  const [emblaRef, emblaApi] = useEmblaCarousel(
    !loading && feed.length > 0 ? options : undefined,
    [
      Autoplay({
        playOnInit: true,
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: false
      })
    ]
  )

  usePrevNextButtons(emblaApi)
  useAutoplayProgress(emblaApi, progressNode)

  /* ---------- LOADER ---------- */
  if (loading || feed.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-light tracking-wide">
          Loading collections...
        </span>
      </div>
    )
  }

  /* ---------- CAROUSEL ---------- */
  return (
    <div className="embla w-full">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {feed.map(({ genre, books }) => (
            <div className="embla__slide" key={genre}>
              <ItemSlide genre={genre} books={books} />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__progress">
        <div className="embla__progress__bar" ref={progressNode} />
      </div>
    </div>
  )
}



export default EmblaCarouselAutoplayProgress
