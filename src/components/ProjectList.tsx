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
    <div ref={containerRef} className='space-y-0'>
      {projects.map((project, index) => (
        <article 
          key={index}
          className='fade-up opacity-0 translate-y-4 transition-all duration-700'
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          {/* Divider */}
          <div className='h-px bg-gray-200 dark:bg-gray-800' />
          
          <div className='py-12 md:py-16'>
            {/* Project header row */}
            <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6'>
              <div className='flex items-center gap-4'>
                <span className='text-sm font-mono text-gray-400 dark:text-gray-500'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className='text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  {project.subtitle}
                </span>
                {project.active && (
                  <span className='inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400'>
                    <span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Project title - clickable */}
            <Link 
              href={project.link} 
              target='_blank'
              className='group block mb-4'
            >
              <h3 className='text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors leading-tight'>
                {project.title}
                <svg 
                  className='inline-block w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all' 
                  fill='none' 
                  viewBox='0 0 24 24' 
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                </svg>
              </h3>
            </Link>

            {/* Description */}
            <p className='text-gray-600 dark:text-gray-400 leading-relaxed mb-6 max-w-2xl'>
              {project.description}
            </p>

            {/* Tech stack - muted */}
            <p className='text-sm text-gray-400 dark:text-gray-500'>
              {project.tags.join(' · ')}
            </p>
          </div>
        </article>
      ))}
      
      {/* Final divider */}
      <div className='fade-up opacity-0 translate-y-4 transition-all duration-700 h-px bg-gray-200 dark:bg-gray-800' style={{ transitionDelay: `${projects.length * 100}ms` }} />
    </div>
  );
}
