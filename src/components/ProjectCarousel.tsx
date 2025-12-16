'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
  active: boolean;
}

interface ProjectCarouselProps {
  projects: Project[];
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className='flex justify-between items-end mb-12 reveal-section reveal-up'>
        <div>
          <h2 className='text-4xl font-bold mb-2'>Recent <span className='text-primary'>Projects</span></h2>
          <p className='text-gray-500'>Active repositories from GitHub.</p>
        </div>
        <div className='hidden md:flex gap-2'>
          <button 
            onClick={scrollLeft}
            className='p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors'
          >
            <span className='material-symbols-outlined'>chevron_left</span>
          </button>
          <button 
            onClick={scrollRight}
            className='p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors'
          >
            <span className='material-symbols-outlined'>chevron_right</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className='snap-container flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scroll-pl-4'
      >
        {projects.map((project, index) => (
          <div key={index} className='min-w-[85vw] md:min-w-[450px] snap-center reveal-section reveal-right delay-100'>
            <div className='h-full bg-white dark:bg-[#181818] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all duration-300 flex flex-col group shadow-lg'>
              <div className='relative h-56 overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10'></div>
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                {project.active && (
                  <div className='absolute top-4 right-4 z-20 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1'>
                    <span className='w-2 h-2 bg-white rounded-full animate-pulse'></span> Active
                  </div>
                )}
                <div className='absolute bottom-4 left-4 z-20'>
                  <h3 className='text-2xl font-bold text-white'>{project.title}</h3>
                  <p className='text-gray-300 text-sm'>{project.subtitle}</p>
                </div>
              </div>
              <div className='p-6 flex-1 flex flex-col'>
                <p className='text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed line-clamp-3'>
                  {project.description}
                </p>
                <div className='mt-auto'>
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {project.tags.map(tag => (
                      <span key={tag} className='px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-md font-mono'>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link 
                    href={project.link}
                    target='_blank'
                    className='w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm'
                  >
                    <span className='material-symbols-outlined text-lg'>code</span> View Repository
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Hint */}
      <div className='mt-6 flex justify-center md:hidden animate-pulse'>
        <span className='text-xs text-gray-500 flex items-center gap-1'>
          <span className='material-symbols-outlined text-sm'>swipe_left</span> Swipe to explore
        </span>
      </div>
    </>
  );
}
