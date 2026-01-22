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
import { sampleBooks } from '@/components/sampleBooks'

export interface Book {
  id?: string
  volumeInfo?: {
    title?: string
    authors?: string[]
    categories?: string[]
    imageLinks?: {
      thumbnail?: string
    }
  }
  saleInfo?: {
    listPrice?: {
      amount?: number
    }
  }
}

type PropType = {
  books: Book[]
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarouselAutoplayProgress: React.FC<PropType> = ({
  books,
  options
}) => {
  const progressNode = useRef<HTMLDivElement>(null)

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({
      playOnInit: true,
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: false
    })
  ])

  usePrevNextButtons(emblaApi)
  useAutoplayProgress(emblaApi, progressNode)

  return (
    <div className="embla w-full">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">
            <ItemSlide genre="horror" books={books} />
          </div>
          <div className="embla__slide">
            <ItemSlide genre="scifi" books={books} />
          </div>
          <div className="embla__slide">
            <ItemSlide genre="romance" books={books} />
          </div>
        </div>
      </div>

      <div className="embla__progress">
        <div className="embla__progress__bar" ref={progressNode} />
      </div>
    </div>
  )
}

export default EmblaCarouselAutoplayProgress
