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
      className='min-h-screen flex items-center bg-white dark:bg-[#0a0a0a] relative'
    >
      {/* Subtle grid background */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]' />
      
      <div className='relative z-10 w-full max-w-3xl mx-auto px-6 py-32'>
        {/* Intro line */}
        <p className='fade-up opacity-0 translate-y-4 transition-all duration-700 text-sm tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-6'>
          Engineering Student & Developer — India
        </p>

        {/* Main headline */}
        <h1 className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-100 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-8'>
          I&apos;m <span className='font-semibold'>Simiyon Vinscent Samuel</span>, building intelligent systems at the intersection of{' '}
          <span className='text-gray-500 dark:text-gray-400'>automation</span>,{' '}
          <span className='text-gray-500 dark:text-gray-400'>web3</span>, and{' '}
          <span className='text-gray-500 dark:text-gray-400'>full-stack development</span>.
        </h1>

        {/* Supporting text */}
        <p className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-200 text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-12 max-w-2xl'>
          I focus on crafting robust, scalable solutions—from low-level automation scripts to production-ready web applications. Currently exploring decentralized systems and AI-powered workflows.
        </p>

        {/* Status indicator */}
        <div className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-300 flex items-center gap-3 mb-12'>
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
          </span>
          <span className='text-sm text-gray-600 dark:text-gray-400'>Available for collaborations and opportunities</span>
        </div>

        {/* CTA */}
        <div className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-[400ms] flex flex-wrap gap-4'>
          <Link
            href='#projects'
            className='inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-full hover:opacity-80 transition-opacity'
          >
            View my work
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
            </svg>
          </Link>
          <Link
            href='https://github.com/blackscythe123'
            target='_blank'
            className='inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors'
          >
            GitHub
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
            </svg>
          </Link>
        </div>

        {/* Minimal avatar - positioned subtly */}
        <div className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-500 absolute top-32 right-6 md:right-12 lg:right-24 hidden md:block'>
          <div className='w-20 h-20 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800'>
            <Image
              src='https://github.com/blackscythe123.png'
              alt='Simiyon Vinscent Samuel'
              width={80}
              height={80}
              className='object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  );
}

