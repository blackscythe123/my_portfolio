'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <footer 
      ref={sectionRef}
      id='contact' 
      className='py-10 md:py-16 lg:py-18 bg-gray-50 dark:bg-[#0a0a0a] relative'
    >
      <div className='max-w-3xl mx-auto px-4 sm:px-6'>
        {/* Main CTA */}
        <div className='mb-10 md:mb-12'>
          <p className='fade-up opacity-0 translate-y-4 transition-all duration-700 text-xs sm:text-sm tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-4 sm:mb-5'>
            Get in Touch
          </p>
          <h2 className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-100 text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white leading-tight mb-6 sm:mb-7'>
            Have a project in mind?<br />
            <span className='font-semibold'>Let&apos;s build something together.</span>
          </h2>
          <p className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-200 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 sm:mb-9 max-w-xl'>
            I&apos;m always open to discussing new opportunities, interesting projects, or just having a conversation about technology and design.
          </p>
          
          {/* Primary CTA */}
          <div className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-300'>
            <Link
              href='mailto:samsamuel234567@gmail.com'
              className='inline-flex items-center gap-3 text-lg sm:text-xl md:text-2xl font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors group break-words'
            >
              samsamuel234567@gmail.com
              <svg 
                className='w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all' 
                fill='none' 
                viewBox='0 0 24 24' 
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
              </svg>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-[400ms] h-px bg-gray-200 dark:bg-gray-800 mb-10' />

        {/* Secondary Links */}
        <div className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-500 flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8'>
          <div className='flex flex-wrap items-center gap-6 sm:gap-8'>
            <Link 
              href='https://github.com/blackscythe123' 
              target='_blank'
              className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
            >
              GitHub
            </Link>
            <Link 
              href='https://www.linkedin.com/in/simiyonvinscentsamuel/' 
              target='_blank'
              className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
            >
              LinkedIn
            </Link>
            <Link 
              href='mailto:samsamuel234567@gmail.com'
              className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
            >
              Email
            </Link>
          </div>
          
          <p className='text-sm text-gray-400 dark:text-gray-500'>
            © 2025 Simiyon Vinscent Samuel
          </p>
        </div>
      </div>
    </footer>
  );
}

