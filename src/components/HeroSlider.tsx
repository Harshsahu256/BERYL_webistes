import React, { useState, useEffect } from 'react';
import { HERO_SLIDES } from '../data/companyData';
import { ChevronLeft, ChevronRight, Sparkles, FileText } from 'lucide-react';

interface HeroSliderProps {
  customTitle?: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ customTitle }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentSlide];
  const displayTitle = customTitle || activeSlide.title;

  return (
    <div className="relative w-full bg-slate-950 text-white overflow-hidden">
      {/* Banner Image Stage */}
      <div className="relative h-56 sm:h-72 md:h-96 w-full overflow-hidden">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
            />
            {/* Multi-stage Modern Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-slate-900/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />

            {/* Slide Content Caption Overlay */}
            <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center items-start space-y-3">
              <span className="inline-flex items-center space-x-1.5 bg-blue-500/20 text-blue-300 font-bold px-3 py-1 rounded-full border border-blue-400/30 text-xs backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Beryl Investor Disclosures Portal</span>
              </span>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg max-w-2xl leading-tight">
                {slide.title}
              </h1>

              {slide.subtitle && (
                <p className="text-xs sm:text-base text-slate-300 font-medium max-w-xl line-clamp-2 drop-shadow-sm">
                  {slide.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Carousel Arrow Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-slate-900/70 hover:bg-blue-600 text-white p-2.5 sm:p-3 rounded-2xl backdrop-blur-md border border-slate-700/60 shadow-xl transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-slate-900/70 hover:bg-blue-600 text-white p-2.5 sm:p-3 rounded-2xl backdrop-blur-md border border-slate-700/60 shadow-xl transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Modern Glass Section Title & Subcategory Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800 text-white py-3.5 px-6 shadow-2xl relative z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                {displayTitle}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Official SEBI & Stock Exchange Compliance Records (BSE: 524680)
              </p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-800">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'w-7 bg-blue-500 shadow-md shadow-blue-500/50'
                    : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
