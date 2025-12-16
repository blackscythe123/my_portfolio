'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
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
    <section 
      ref={sectionRef}
      id='about' 
      className='min-h-screen flex items-start lg:items-center bg-white dark:bg-[#0a0a0a] relative overflow-hidden pt-10 sm:pt-12 lg:pt-14'
    >
      {/* Subtle grid background */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]' />
      
      <div className='relative z-10 w-full'>
        <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-14 md:py-18'>
          {/* Left Column: Name + Avatar + Status */}
          <div className='flex flex-col items-start justify-center order-1'>
            <div className='fade-up opacity-0 translate-y-4 transition-all duration-700'>
              <div className='mb-4 sm:mb-6 md:mb-8'>
                <Image
                  src='https://github.com/blackscythe123.png'
                  alt='Simiyon Vinscent Samuel'
                  width={140}
                  height={140}
                  className='w-20 md:w-28 lg:w-[140px] h-20 md:h-28 lg:h-[140px] object-cover rounded-lg border border-gray-200 dark:border-gray-800'
                />
              </div>
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 dark:text-white leading-[1.05] mb-3 sm:mb-4 md:mb-6 max-w-xl break-words'>
                Simiyon Vinscent Samuel L
              </h1>
              <div className='flex items-center gap-2 md:gap-3'>
                <span className='relative flex h-2 w-2'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                  <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
                </span>
                <span className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>Available for work</span>
              </div>
            </div>
          </div>

          {/* Right Column: Description + CTA */}
          <div className='flex flex-col items-start justify-center order-2 lg:order-2'>
            <div className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-100'>
              <p className='text-[11px] sm:text-xs md:text-sm tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-3 sm:mb-4 md:mb-6'>
                Engineering Student & Developer — India
              </p>
              <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-light text-gray-900 dark:text-white leading-tight mb-4 sm:mb-6 md:mb-8 max-w-2xl'>
                I build intelligent systems at the intersection of <span className='font-semibold'>automation</span>, <span className='font-semibold'>web3</span>, and <span className='font-semibold'>full-stack development</span>.
              </h2>
              <p className='text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-2xl'>
                Crafting robust, scalable solutions—from low-level automation scripts to production-ready web applications. Currently exploring decentralized systems and AI-powered workflows.
              </p>
              
              <div className='flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4'>
                <Link
                  href='#projects'
                  className='inline-flex items-center justify-center sm:justify-start gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs md:text-sm font-medium hover:opacity-80 transition-opacity'
                >
                  View my work
                  <svg className='w-3.5 h-3.5 md:w-4 md:h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                  </svg>
                </Link>
                <Link
                  href='https://github.com/blackscythe123'
                  target='_blank'
                  className='inline-flex items-center justify-center sm:justify-start gap-2 px-5 md:px-6 py-2.5 md:py-3 text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors'
                >
                  GitHub
                  <svg className='w-3.5 h-3.5 md:w-4 md:h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

