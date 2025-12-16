'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface Project {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  link: string;
  active: boolean;
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = containerRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className='relative w-full max-w-7xl mx-auto py-8 md:py-12 overflow-hidden'
    >
      <div className='pointer-events-none absolute inset-0 flex justify-center'>
        <div className='w-px h-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800' />
      </div>

      <div className='flex flex-col gap-0'>
        {projects.map((project, index) => {
          const isRight = index % 2 !== 0;
          return (
            <article
              key={index}
              className='fade-up opacity-0 translate-y-6 transition-all duration-700 border-t border-gray-200 dark:border-gray-800 group hover:bg-gray-100/80 dark:hover:bg-gray-900/60'
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div
                className={`relative px-4 sm:px-6 md:px-10 lg:px-14 py-10 md:py-14 flex ${isRight ? 'justify-end' : 'justify-start'}`}
              >
                {/* node on the vine */}
                <span className='pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 shadow-sm' />

                <div
                  className={`max-w-5xl w-full flex flex-col gap-5 ${isRight ? 'lg:pl-24 lg:text-right lg:items-end' : 'lg:pr-24 lg:text-left lg:items-start'}`}
                >
                  <div className={`flex items-center gap-3 text-[11px] md:text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400 ${isRight ? 'justify-end' : 'justify-start'}`}>
                    <span className='font-mono'>{String(index + 1).padStart(2, '0')}</span>
                    <span className='hidden sm:inline'>{project.subtitle}</span>
                    {project.active && (
                      <span className='inline-flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400'>
                        <span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
                        Active
                      </span>
                    )}
                  </div>

                  <div className={`flex flex-col ${isRight ? 'items-end text-right' : 'items-start text-left'} gap-3`}>
                    <Link
                      href={project.link}
                      target='_blank'
                      className='group/link inline-flex items-center gap-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[0.95] text-gray-900 dark:text-white transition-colors duration-300'
                    >
                      {project.title}
                      <svg
                        className='w-6 h-6 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                        />
                      </svg>
                    </Link>

                    <p
                      className={`text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl transition-all duration-500 ${isRight ? 'md:text-right md:translate-x-6' : 'md:text-left md:-translate-x-6'} opacity-100 md:opacity-0 translate-x-0 md:group-hover:opacity-100 md:group-hover:translate-x-0`}
                    >
                      {project.description}
                    </p>

                    <p className='text-xs md:text-sm text-gray-400 dark:text-gray-500 tracking-wide'>
                      {project.tags.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        <div className='border-t border-gray-200 dark:border-gray-800' />
      </div>
    </div>
  );
}
