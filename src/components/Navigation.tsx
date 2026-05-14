'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type SectionId = 'about' | 'skills' | 'notes' | 'craft' | 'projects' | 'contact';

const SECTIONS: { id: SectionId; label: string; nav: string }[] = [
  { id: 'about', label: 'HERO', nav: 'Home' },
  { id: 'skills', label: 'STACK', nav: 'Arsenal' },
  { id: 'notes', label: 'NOTES', nav: 'Notes' },
  { id: 'craft', label: 'CRAFT', nav: 'Craft' },
  { id: 'projects', label: 'INDEX', nav: 'Index' },
  { id: 'contact', label: 'REACH', nav: 'Reach' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('about');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        });
      },
      { threshold: 0.35, rootMargin: '-30% 0px -30% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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

  const scrollToSection = useCallback((id: SectionId) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* TOP NAV */}
      <nav
        id='navbar'
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
          isScrolled
            ? 'bg-ink-navy/90 backdrop-blur-md border-b border-bone/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-full'>
          <div className='flex justify-between items-center h-full gap-3'>
            {/* Logo */}
            <Link
              href='#'
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className='font-display font-extrabold text-bone hover:text-sodium transition flex items-center gap-2.5 text-sm tracking-tight'
            >
              <span
                className='block w-3 h-3 rotate-45'
                style={{ background: 'linear-gradient(135deg, #dc1c2e, #ffe83a)' }}
              />
              S.V.S
            </Link>

            {/* Desktop pill nav */}
            <div className='hidden md:flex items-center gap-1 bg-bone/[0.04] p-1 rounded-full backdrop-blur-md border border-bone/10'>
              {SECTIONS.map(({ id, nav }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`font-display font-bold text-[11px] uppercase tracking-[0.06em] px-4 py-2 rounded-full transition ${
                    activeSection === id
                      ? 'bg-sodium text-ink-navy'
                      : 'text-bone/65 hover:text-sodium'
                  }`}
                >
                  {nav}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className='flex items-center gap-3'>
              {/* Socials (desktop only, compact) */}
              <div className='hidden lg:flex gap-2'>
                {[
                  { label: 'G', title: 'GitHub', href: 'https://github.com/blackscythe123' },
                  { label: 'in', title: 'LinkedIn', href: 'https://www.linkedin.com/in/simiyonvinscentsamuel/' },
                  { label: 'x', title: 'X / Twitter', href: '#' },
                  { label: 'D', title: 'Discord', href: '#' },
                ].map((s) => (
                  <Link
                    key={s.title}
                    href={s.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    title={s.title}
                    className='w-8 h-8 rounded-full border border-bone/20 flex items-center justify-center text-bone text-xs font-display font-bold hover:bg-sodium hover:text-ink-navy hover:border-sodium hover:-translate-y-0.5 transition'
                  >
                    {s.label}
                  </Link>
                ))}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className='font-mono text-[10px] uppercase tracking-[0.18em] text-bone/50 hover:text-sodium transition px-2'
                aria-label='Toggle theme'
              >
                {isDark ? 'Light' : 'Dark'}
              </button>

              {/* Mobile menu button */}
              <button
                className='md:hidden text-bone/70 hover:text-sodium transition'
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label='Toggle menu'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className='absolute top-16 left-0 right-0 bg-ink-navy/95 backdrop-blur-md border-b border-bone/10 md:hidden'>
            <div className='max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2'>
              {SECTIONS.map(({ id, nav }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`text-left font-display font-bold text-sm uppercase tracking-[0.08em] py-2 transition ${
                    activeSection === id ? 'text-sodium' : 'text-bone/70 hover:text-sodium'
                  }`}
                >
                  {nav}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* VERTICAL BRAND MARK (left) */}
      <div
        className='hidden lg:block fixed left-4 top-24 z-40 font-display font-bold text-[10px] tracking-[0.3em] uppercase text-bone/40 pointer-events-none'
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        SIMIYON &middot; V.S.S
      </div>

      {/* STICKY LEFT RAIL */}
      <div className='hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-5'>
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`group font-display font-bold text-[10px] tracking-[0.22em] uppercase pl-6 relative transition text-left ${
              activeSection === id ? 'text-sodium' : 'text-bone/40 hover:text-bone'
            }`}
          >
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all ${
                activeSection === id
                  ? 'w-4 h-0.5 bg-sodium [box-shadow:0_0_8px_rgba(255,232,58,0.7)]'
                  : 'w-2.5 h-px bg-bone/30 group-hover:bg-bone'
              }`}
            />
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
