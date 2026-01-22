'use client';
import Main from "../components/Main";
import Hashtag from "../components/Hashtag";
import BookCarousel from "../components/BookCarousel";
import { sampleBooks } from "../components/sampleBooks";
import type { Book } from "../components/BookCarousel";
import EmblaCarouselOpacity from "../components/carousel/Embla Carousel Opacity React/Carousel"
import { EmblaOptionsType } from 'embla-carousel'
import EmblaCarouselAutoplayProgress from "@/components/carousel/Embla Carousel Auto Progress React/EmblaCarousel"
const OPTIONS: EmblaOptionsType = { loop: true }
const number: number[] = [1, 2, 4, 6, 7]
import { useSnapScroll } from '../hooks/useSnapScroll'
import ItemSlide from "@/components/carousel/Embla Carousel Auto Progress React/ItemSlide";
export default function Home() {
  useSnapScroll()
  return (
    <div
      id="snap-container"
      className="h-screen overflow-hidden overflow-y-scroll snap-y snap-mandatory"
    >

      <section className="h-screen snap-start">
        <Main />
      </section>

      <section className="h-screen snap-start">
        <div className="pt-[var(--navbar-h)] h-full">
          <EmblaCarouselOpacity books={sampleBooks as Book[]} options={OPTIONS} />
        </div>
      </section>


      <section className="h-screen snap-start">
        <div className="pt-[var(--navbar-h)]  h-full">
          <EmblaCarouselAutoplayProgress
            books={sampleBooks as Book[]}
            slides={[0, 1, 2, 3]}
            options={{ loop: true }}
          />

        </div>
      </section>


    </div>
  )
}

