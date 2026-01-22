'use client';

import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';

import ItemCard from './ItemCard';

/* ✅ STRICT Book TYPE */
export interface Book {
    id: string;
    volumeInfo: {
        title: string;
        authors: string[];
        imageLinks: {
            thumbnail: string;
        };
    };
    saleInfo: {
        listPrice: {
            amount: number;
        };
    };
}

interface BookCarouselProps {
    heading: string;
    books: Book[];
    type?: 'default' | 'auto' | 'center';
}

export default function BookCarousel({
    heading,
    books,
    type = 'default',
}: BookCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [liked, setLiked] = useState<string[]>([]);

    /* Embla options */
    const emblaOptions: EmblaOptionsType = {
        loop: true,
        align: type === 'center' ? 'center' : 'start',
        skipSnaps: false,
    };

    const plugins: EmblaPluginType[] =
        type === 'auto'
            ? [Autoplay({ delay: 2500, stopOnInteraction: false })]
            : [];

    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, plugins);

    /* Track selected slide */
    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setCurrentSlide(emblaApi.selectedScrollSnap());
        };

        emblaApi.on('select', onSelect);
        onSelect();

        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi]);

    return (
        <section className="w-full py-12">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-6 px-2">
                {heading}
            </h2>

            {/* Embla */}
            <div className="overflow-hidden w-full" ref={emblaRef}>
                <div className="flex gap-6">
                    {books.map((book, index) => {
                        const isCenter = type === 'center' && index === currentSlide;

                        return (
                            <motion.div
                                key={book.id}
                                className="fit"
                                animate={{ scale: isCenter ? 1.4 : 0.9 }}
                                transition={{ type: 'spring', stiffness: 280 }}
                            >
                                <ItemCard
                                    book={book}
                                    liked={liked}
                                    setLiked={setLiked}
                                    onClick={() =>
                                        console.log('Clicked book:', book.id)
                                    }
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Dots */}
            {(type === 'auto' || type === 'center') && (
                <div className="flex justify-center mt-4 gap-2">
                    {books.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => emblaApi?.scrollTo(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? 'bg-black' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
