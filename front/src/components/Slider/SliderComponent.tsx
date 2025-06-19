'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Slide = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: 'Kit Arcano de invierno',
    description: 'Descubre el poder del tarot y otras herramientas',
    imageUrl: '/slide4.png',
    ctaText: 'Comprar ahora',
    ctaLink: '/products/918f6eee-1fec-4ca1-9e42-b97f3a9b798b',
  },
  {
    id: 2,
    title: 'Ofertas Exclusivas',
    description: 'Hasta 40% de descuento en quemantes',
    imageUrl: '/slide1.png',
    ctaText: 'Ver ofertas',
    ctaLink: '/products?category=Specials',
  },
  {
    id: 3,
    title: 'Renueva las energías',
    description: 'Nuevos productos energéticos',
    imageUrl: '/slide9.png',
    ctaText: 'Descubrir',
    ctaLink: '/products',
  },
  {
    id: 4,
    title: 'Todos tus cristales estan aqui',
    description: 'Cristales y piedras unicos',
    imageUrl: '/slide2.png',
    ctaText: 'Descubrir',
    ctaLink: '/products?category=Cristales',
  },
];

const ComponentSlider = () => {
  return (
    <div className="w-screen h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            <div className="absolute inset-0 z-0">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40 z-10" />
            </div>

            <div className="relative z-20 flex flex-col justify-center items-start h-full px-6 text-white max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold mb-3">{slide.title}</h2>
              <p className="text-base md:text-lg mb-5">{slide.description}</p>
              {slide.ctaText && slide.ctaLink && (
                <Link
                  href={slide.ctaLink}
                  className="bg-white text-gray-900 px-5 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition"
                >
                  {slide.ctaText}
                </Link>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ComponentSlider;
