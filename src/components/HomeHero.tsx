import React, { useState, useEffect } from 'react';
import { SiteConfig, PortfolioItem } from '../types';
import { ChevronRight, ChevronLeft, ArrowDown, Monitor, Smartphone, Grid, Play } from 'lucide-react';

interface HomeHeroProps {
  config: SiteConfig;
  portfolioItems: PortfolioItem[];
  onScrollToSection: (id: string) => void;
}

export default function HomeHero({ config, portfolioItems, onScrollToSection }: HomeHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter items that have overview images or main images to display in mockups
  const showcaseItems = portfolioItems.filter(
    (item) => item.category === 'DETAIL_PAGE' || item.category === 'REDESIGN' || item.category === 'BANNER' || item.category === 'THREE_D'
  ).slice(0, 4);

  // Auto-slide effect
  useEffect(() => {
    if (showcaseItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % showcaseItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [showcaseItems.length]);

  const getScreenImage = (item: PortfolioItem) => {
    if (item.category === 'DETAIL_PAGE') return item.overviewImage;
    if (item.category === 'REDESIGN') return item.afterImage;
    if (item.category === 'BANNER') return item.image;
    if (item.category === 'THREE_D') return item.image;
    return '';
  };

  const getMobileScreenImage = (item: PortfolioItem) => {
    if (item.category === 'DETAIL_PAGE' && item.highlights && item.highlights[0]) {
      return item.highlights[0].image;
    }
    if (item.category === 'REDESIGN') return item.beforeImage;
    if (item.category === 'DETAIL_PAGE') return item.overviewImage;
    if (item.category === 'THREE_D') return item.image;
    if (item.category === 'BANNER') return item.image;
    return '';
  };

  return (
    <section
      id="home"
      className="min-h-screen pt-28 pb-16 flex flex-col justify-center relative overflow-hidden bg-gradient-to-b from-[#F5F5F2] via-[#EAEAE5] to-[#F5F5F2]"
    >
      {/* Premium subtle background architectural perspective grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#1C1C1A_1px,transparent_1px),linear-gradient(to_bottom,#1C1C1A_1px,transparent_1px)] [background-size:40px_40px]"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Visual copy & CTA Buttons with Swiss Minimalist Layout */}
        <div className="lg:col-span-6 flex flex-col space-y-6 select-none text-left">
          {/* Small Caption */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[14px] sm:text-[16px] font-black tracking-[0.25em] text-[#1C1C1A] uppercase block animate-fade-in">
              PARK SEONGMI
            </span>
            <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.12em] text-[#B89B73] uppercase inline-block animate-fade-in">
              WEB &amp; VISUAL DESIGNER
            </span>
          </div>

          {/* Divider 1 */}
          <div className="h-[1px] bg-[#E8E8E3] w-full max-w-lg"></div>

          {/* Main Title */}
          <div className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-[-0.04em] leading-[1.12]">
            {config.heroSubTitleLines && config.heroSubTitleLines.length > 0 ? (
              config.heroSubTitleLines.map((line, idx) => (
                <p 
                  key={idx} 
                  className={`${idx === 0 ? 'text-[#A7A7A7]' : 'text-[#111111]'} font-extrabold ${idx > 0 ? 'mt-1 sm:mt-2' : ''}`}
                >
                  {line}
                </p>
              ))
            ) : (
              <>
                <p className="text-[#A7A7A7] font-extrabold">브랜드의 가치를</p>
                <p className="text-[#111111] font-extrabold mt-1 sm:mt-2">디자인으로 전달하는</p>
                <p className="text-[#111111] font-extrabold mt-1 sm:mt-2">박성미입니다.</p>
              </>
            )}
          </div>

          {/* Divider 2 */}
          <div className="h-[1px] bg-[#E8E8E3] w-full max-w-lg"></div>

          {/* Description */}
          <p className="text-[14px] sm:text-[16px] text-[#666666] font-normal leading-[1.8] tracking-normal max-w-lg whitespace-pre-line">
            {config.introTitle}
          </p>

          {/* Divider 3 */}
          <div className="h-[1px] bg-[#E8E8E3] w-full max-w-lg"></div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={() => onScrollToSection('portfolio')}
              className="px-6 py-3.5 bg-[#1C1C1A] text-white hover:bg-[#B89B73] text-[12px] sm:text-[13px] font-bold tracking-[0.2em] rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2 cursor-pointer animate-fade-in"
            >
              <span>PORTFOLIO</span>
              <ChevronRight size={14} className="text-white" />
            </button>
            <button
              onClick={() => onScrollToSection('contact')}
              className="px-6 py-3.5 bg-transparent border border-[#1C1C1A] text-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-white hover:border-[#1C1C1A] text-[12px] sm:text-[13px] font-bold tracking-[0.2em] rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2 cursor-pointer animate-fade-in"
            >
              <span>CONTACT</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Elegant Minimalist Portfolio Image Showcase with Chevron Arrows */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          
          {/* Interactive Showcase Container with absolute next/prev arrows */}
          <div className="relative aspect-[16/10] bg-[#FAFDFB] rounded-3xl overflow-hidden shadow-2xl border border-[#E8E8E3] group flex items-center justify-center">
            
            {showcaseItems.length > 0 && (
              <div className="w-full h-full relative">
                {/* Full-bleed Showcase Image */}
                <img
                  src={getScreenImage(showcaseItems[currentSlide])}
                  alt={showcaseItems[currentSlide]?.title}
                  className="w-full h-full object-cover object-top transition-all duration-700 ease-in-out hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Subtle dark overlay on hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Left/Right Arrow Navigation Buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#1C1C1A] flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-[#E8E8E3] z-20"
                  aria-label="Previous Project"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev + 1) % showcaseItems.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#1C1C1A] flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-[#E8E8E3] z-20"
                  aria-label="Next Project"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Dots Indicator for Slide view */}
          {showcaseItems.length > 0 && (
            <div className="flex items-center justify-center space-x-2">
              {showcaseItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'w-6 bg-[#1C1C1A]' : 'w-1.5 bg-[#E8E8E3] hover:bg-[#70706B]'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Floating Scroll Indicator */}
      <button
        onClick={() => onScrollToSection('about')}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-[#70706B] hover:text-[#1C1C1A] transition-colors cursor-pointer select-none"
      >
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1">ABOUT ME</span>
        <ArrowDown size={14} className="animate-bounce" />
      </button>
    </section>
  );
}
