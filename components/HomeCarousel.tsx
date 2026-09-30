'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: 'Empowering Civic Education',
    description: 'Building a stronger democracy through informed citizenship and principled decision-making.',
    image: '/logo-dark.png',
    cta: 'Learn More',
    ctaLink: '/about',
  },
  {
    id: 2,
    title: 'Join the Movement',
    description: 'Be part of a community dedicated to logical reasoning, fairness, and American values.',
    image: '/logo-light.png',
    cta: 'Get Involved',
    ctaLink: '/get-involved',
  },
  {
    id: 3,
    title: 'Read Our Latest Articles',
    description: 'Stay informed with in-depth analysis on current events and constitutional principles.',
    image: '/logo-transparent.png',
    cta: 'Explore Articles',
    ctaLink: '/articles',
  },
];

export function HomeCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(0, 10, 46, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        minHeight: '400px',
      }}
    >
      {/* Slides Container */}
      <div className="relative h-full">
        {/* Current Slide */}
        <div className="px-8 py-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center gap-8">
          {/* Content */}
          <div className="flex-1 space-y-6 animate-fade-in">
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
              style={{ color: isDark ? '#fff' : '#000' }}
            >
              {slide.title}
            </h2>
            <p
              className="text-lg md:text-xl max-w-2xl"
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}
            >
              {slide.description}
            </p>
            <Link
              href={slide.ctaLink}
              className="inline-block px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
              }}
            >
              {slide.cta} →
            </Link>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center">
            <div
              className="relative w-full max-w-md h-64 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain p-8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all hover:scale-110 z-10"
        style={{
          background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          color: isDark ? '#fff' : '#000',
        }}
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all hover:scale-110 z-10"
        style={{
          background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          color: isDark ? '#fff' : '#000',
        }}
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="transition-all rounded-full"
            style={{
              width: currentSlide === index ? '32px' : '12px',
              height: '12px',
              background: currentSlide === index
                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                : isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
