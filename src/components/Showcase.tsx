'use client';

import Image from 'next/image';
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export const Showcase = () => {
  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false
    }),
  );

  const images = [
    { src: '/assets/png/events/2025Bioskop.png', alt: '2025 Bioskop' },
    {
      src: '/assets/png/events/armageddonBioskop.png',
      alt: 'Armageddon Bioskop',
    },
    { src: '/assets/png/events/avengerBioskop.png', alt: 'Avenger Bioskop' },
    {
      src: '/assets/png/events/cleopatraBioskop.png',
      alt: 'Cleopatra Bioskop',
    },
    { src: '/assets/png/events/legacyBioskop.png', alt: 'Legacy Bioskop' },
    { src: '/assets/png/events/lockBioskop.png', alt: 'Lock Bioskop' },
    { src: '/assets/png/events/romeoBioskop.png', alt: 'Romeo Bioskop' },
    { src: '/assets/png/events/supermanBioskop.png', alt: 'Superman Bioskop' },
    { src: '/assets/png/events/virusBioskop.png', alt: 'Virus Bioskop' },
  ];

  return (
    <>
      <div className="bg-black text-white flex justify-center items-center w-full pb-[72px] bg-gradient-to-b from-black to-[#5D2CAB]">
        <div className="container">
          <h2 className="flex text-5xl justify-center items-center font-bold hover:drop-shadow-[0_0_0.3rem_#ffffff]">
            Most Popular Event
          </h2>
          <p className="flex justify-center items-center text-center text-white/70 md:mx-72 mt-4">
            Get your ticket now and unlock access to exclusive perks,
            unforgettable moments, and premium experiences!
          </p>
          <div className="">
            <div className="flex justify-center items-center w-full p-10">
              <Carousel
                plugins={[plugin.current]}
                className="flex justify-center items-center w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent className="-ml-1">
                  {images.map(({ src, alt }, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-1 md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <span className="text-2xl font-semibold">
                              <Image
                                key={index}
                                src={src}
                                alt={alt}
                                loading="lazy"
                                width={1000}
                                height={1000}
                                // h-[500px] w-auto
                                className="h-auto w-auto"
                              />
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-black" />
                <CarouselNext className="bg-black" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
