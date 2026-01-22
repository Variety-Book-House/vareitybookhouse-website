"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const slides = [
  "/CoverImage2.png",
  "/CoverImage3.png",
  "/CoverImage4.png",
];

const Main: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(1);
  const [count, setCount] = React.useState(slides.length);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        opts={{ loop: true }}
      >
        <CarouselContent className="h-screen">
          {slides.map((src, index) => (
            <CarouselItem key={index} className="relative h-screen">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                priority={index === 0}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_100%_75%_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_50%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controls */}
        <CarouselPrevious variant="outline" className="left-6" />
        <CarouselNext variant="outline" className="right-6" />
      </Carousel>

      {/* Slide indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/80">
        {current} / {count}
      </div>
    </section>
  );
};

export default Main;
