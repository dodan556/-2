import React, { useState, useEffect } from 'react';
import { Menu, X, Lock } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  isAdminActive: boolean;
}

export default function Header({ onAdminClick, isAdminActive }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#E8E8E3] py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo / Name with SM branding */}
        <button
          onClick={() => scrollToSection('home')}
          className="group flex items-center space-x-2.5 text-left cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 bg-[#1C1C1A] text-white flex items-center justify-center font-serif font-black tracking-tighter text-xs transition-transform group-hover:scale-105 rounded shadow-sm">
            SM
          </div>
          <div className="flex flex-col items-start leading-none select-none">
            <span className="text-xs font-black tracking-[0.2em] text-[#1C1C1A] uppercase">
              PARK SEONGMI
            </span>
          </div>
        </button>

        {/* Floating vertical text on far left and right of the layout */}
        <div className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left items-center z-40 pointer-events-none select-none">
          <span className="text-[10px] font-black tracking-[0.5em] text-[#70706B]/30 uppercase font-mono">
            SEONGMI
          </span>
        </div>
        <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 rotate-90 origin-right items-center z-40 pointer-events-none select-none">
          <span className="text-[10px] font-black tracking-[0.5em] text-[#70706B]/30 uppercase font-mono">
            SEONGMI
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <button
            onClick={() => scrollToSection('home')}
            className={`text-xs font-semibold tracking-widest uppercase cursor-pointer transition-colors ${
              activeSection === 'home'
                ? 'text-[#1C1C1A]'
                : 'text-[#70706B] hover:text-[#1C1C1A]'
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className={`text-xs font-semibold tracking-widest uppercase cursor-pointer transition-colors ${
              activeSection === 'about'
                ? 'text-[#1C1C1A]'
                : 'text-[#70706B] hover:text-[#1C1C1A]'
            }`}
          >
            ABOUT ME
          </button>
          <button
            onClick={() => scrollToSection('portfolio')}
            className={`text-xs font-semibold tracking-widest uppercase cursor-pointer transition-colors ${
              activeSection === 'portfolio'
                ? 'text-[#1C1C1A]'
                : 'text-[#70706B] hover:text-[#1C1C1A]'
            }`}
          >
            PORTFOLIO
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className={`text-xs font-semibold tracking-widest uppercase cursor-pointer transition-colors ${
              activeSection === 'contact'
                ? 'text-[#1C1C1A]'
                : 'text-[#70706B] hover:text-[#1C1C1A]'
            }`}
          >
            CONTACT
          </button>
        </nav>

        {/* Header Right Action (Admin key and Mobile menu toggle) */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onAdminClick}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold tracking-wider uppercase transition-all ${
              isAdminActive
                ? 'bg-[#1C1C1A] text-white border-[#1C1C1A] hover:bg-[#1C1C1A]/90'
                : 'border-[#E8E8E3] text-[#70706B] hover:border-[#1C1C1A] hover:text-[#1C1C1A] bg-white'
            }`}
            title="관리자 설정 메뉴"
          >
            <Lock size={12} />
            <span>{isAdminActive ? 'ADMIN ON' : 'ADMIN'}</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-[#1C1C1A] hover:bg-[#E8E8E3]/50 rounded-lg transition-colors focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[73px] left-0 right-0 bottom-0 bg-[#FBFBFA]/98 backdrop-blur-lg border-t border-[#E8E8E3] z-40 p-8 flex flex-col justify-between">
          <nav className="flex flex-col space-y-6">
            <button
              onClick={() => scrollToSection('home')}
              className="text-left text-lg font-bold tracking-widest text-[#1C1C1A] py-2 border-b border-[#E8E8E3]/30"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-left text-lg font-bold tracking-widest text-[#1C1C1A] py-2 border-b border-[#E8E8E3]/30"
            >
              ABOUT ME
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="text-left text-lg font-bold tracking-widest text-[#1C1C1A] py-2 border-b border-[#E8E8E3]/30"
            >
              PORTFOLIO
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left text-lg font-bold tracking-widest text-[#1C1C1A] py-2 border-b border-[#E8E8E3]/30"
            >
              CONTACT
            </button>
          </nav>
          <div className="text-center py-6 border-t border-[#E8E8E3]/50">
            <p className="text-[10px] tracking-widest text-[#70706B] uppercase font-bold">
              © 2026 PARK SEONG MI. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
