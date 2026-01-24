'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { useNavbarTheme } from '../../context/NavbarThemeContext'
import { getImageDarkness } from '../hooks/useImageDarkness'

const slides = [
  '/CoverImage (2).png',
  '/CoverImage (3).png',
  '/CoverImage4.png',
]

const Main: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(1)
  const { setIsDark } = useNavbarTheme()

  React.useEffect(() => {
    if (!api) return

    const updateTheme = async () => {
      const index = api.selectedScrollSnap()
      const isDark = await getImageDarkness(slides[index])
      setIsDark(isDark)
      setCurrent(index + 1)
    }

    updateTheme()
    api.on('select', updateTheme)
  }, [api, setIsDark])

  return (
    <section className="relative w-full h-screen overflow-x-hidden">
      <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
        <CarouselContent className="h-screen">
          {slides.map((src, index) => (
            <CarouselItem key={index} className="relative h-screen">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-6" />
        <CarouselNext className="right-6" />
      </Carousel>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80">
        {current} / {slides.length}
      </div>
    </section>
  )
}

export default Main
