'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Initial Theme Check
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <nav 
      id='navbar'
      className={`fixed w-full z-50 h-16 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm' 
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
            className='text-sm font-semibold tracking-tight text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
          >
            Simiyon
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-8'>
            <Link 
              href='#about' 
              className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
            >
              About
            </Link>
            <Link 
              href='#skills' 
              className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
            >
              Arsenal
            </Link>
            <Link 
              href='#projects' 
              className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
            >
              Projects
            </Link>
          </div>

          {/* Right Side: Theme Toggle + CTA */}
          <div className='flex items-center gap-6'>
            <button 
              onClick={toggleTheme}
              className='text-xs text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors'
              aria-label="Toggle theme"
            >
              {isDark ? 'Light' : ' Dark'}
            </button>
            
            <Link 
              href='#contact' 
              className='hidden sm:inline-block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
            >
              Contact
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className='md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
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
        <div className='absolute top-16 left-0 right-0 bg-white dark:bg-[#0a0a0a] border-b border-gray-200/50 dark:border-gray-800/50 md:hidden'>
          <div className='max-w-7xl mx-auto px-6 py-4 space-y-3'>
            <Link 
              href='#about' 
              className='block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors py-2'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href='#skills' 
              className='block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors py-2'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Arsenal
            </Link>
            <Link 
              href='#projects' 
              className='block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors py-2'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              href='#contact' 
              className='block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors py-2'
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

