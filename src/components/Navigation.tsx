'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      id='navbar'
      className={`fixed w-full z-50 h-16 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm border-b border-black/20 shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-6 lg:px-8 h-full'>
        <div className='flex justify-between items-center h-full'>
          {/* Logo */}
          <Link
            href='#'
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className='text-sm font-semibold tracking-tight text-black transition-colors hover:text-black/70'
          >
            Simiyon
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-8'>
            <Link 
              href='#act-2' 
              className='text-sm text-black/70 transition-colors hover:text-black'
            >
              About
            </Link>
            <Link 
              href='#act-4' 
              className='text-sm text-black/70 transition-colors hover:text-black'
            >
              Arsenal
            </Link>
            <Link 
              href='#act-6' 
              className='text-sm text-black/70 transition-colors hover:text-black'
            >
              Projects
            </Link>
          </div>

          {/* Right Side: CTA */}
          <div className='flex items-center gap-6'>
            <Link 
              href='#act-7' 
              className='hidden text-sm text-black/70 transition-colors hover:text-black sm:inline-block'
            >
              Contact
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className='text-black/70 transition-colors hover:text-black md:hidden'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='absolute left-0 right-0 top-16 border-b border-black/20 bg-white md:hidden'>
          <div className='max-w-7xl mx-auto px-6 py-4 space-y-3'>
            <Link 
              href='#act-2' 
              className='block py-2 text-sm text-black/70 transition-colors hover:text-black'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href='#act-4' 
              className='block py-2 text-sm text-black/70 transition-colors hover:text-black'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Arsenal
            </Link>
            <Link 
              href='#act-6' 
              className='block py-2 text-sm text-black/70 transition-colors hover:text-black'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              href='#act-7' 
              className='block py-2 text-sm text-black/70 transition-colors hover:text-black'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

