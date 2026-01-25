'use client';
import Main from "../../../components/Main";
import Hashtag from "../../../components/Hashtag";
import BookCarousel from "../../../components/BookCarousel";
import { sampleBooks } from "../../../components/sampleBooks";
import type { Book } from "../../../components/BookCarousel";
import { EmblaOptionsType } from 'embla-carousel'
import EmblaCarouselAutoplayProgress from "@/components/carousel/Embla Carousel Auto Progress React/EmblaCarousel"
const OPTIONS: EmblaOptionsType = { loop: true }
const number: number[] = [1, 2, 4, 6, 7]
import { useSnapScroll } from '../../../hooks/useSnapScroll'
import ItemSlide from "@/components/carousel/Embla Carousel Auto Progress React/ItemSlide";
import ItemCarousel from "@/components/carousel/BestSellerCarousel/ItemCarousel";
import Footer from "@/components/Footer";
const LANGUAGES = [
    'Manga',
    'Novels',
    'Encylopedia',
    'Short Stories',
    'Practice Books',
    'Coloring Books',
]
import LanguageCarousel from "@/components/carousel/LanguageCarousel/ItemCarousel";
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
                    <ItemCarousel
                        title="BEST SELLERS"
                        books={sampleBooks as Book[]}

                    />
                </div>
            </section>



            <section className="h-screen snap-start">
                <div className="pt-[var(--navbar-h)] h-full">
                    <EmblaCarouselAutoplayProgress

                        books={sampleBooks as Book[]}
                        options={OPTIONS}

                    />
                </div>
            </section>
            <section className="h-screen snap-start">
                <div className="pt-[var(--navbar-h)] h-full">
                    <LanguageCarousel books={sampleBooks as Book[]} languages={LANGUAGES} />
                </div>
            </section>

            <section className="h-screen snap-start">
                <div className="pt-[var(--navbar-h)] h-full">
                    <Footer



                    />
                </div>
            </section>

        </div>
    )
}

