'use client';

import { useEffect, useRef } from 'react';

interface SkillCategory {
  title: string;
  capability: string;
  description: string;
  technologies: string[];
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  const skillCategories: SkillCategory[] = [
    {
      title: 'Core Programming',
      capability: 'Building robust systems from the ground up',
      description: 'I write clean, maintainable code across multiple paradigms. From performance-critical applications in C++ to rapid prototyping in Python, I choose the right tool for each problem.',
      technologies: ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Solidity']
    },
    {
      title: 'Web Development',
      capability: 'Creating modern, responsive applications',
      description: 'I build full-stack applications using contemporary frameworks and best practices. My focus is on performance, accessibility, and user experience that scales.',
      technologies: ['React.js', 'Next.js', 'Node.js', 'Express', 'ChromeDevKit', 'FastAPI']
    },
    {
      title: 'Data & Infrastructure',
      capability: 'Managing complexity at scale',
      description: 'I design and maintain data pipelines, databases, and deployment infrastructure. Version control, containerization, and API design are central to my workflow.',
      technologies: ['MySQL', 'Supabase', 'Git/GitHub', 'Docker', 'Postman']
    },
    {
      title: 'Specialized Domains',
      capability: 'Solving complex, domain-specific problems',
      description: 'I explore emerging technologies and apply specialized knowledge to unique challenges—whether it\'s automating workflows, building decentralized applications, or implementing computer vision systems.',
      technologies: ['AI Studios', 'Web3', 'Linux', 'Zappier', 'N8N']
    }
  ];

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

    const elements = sectionRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id='skills' 
      className='py-20 md:py-28 lg:py-32 bg-gray-50 dark:bg-[#0a0a0a]'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-12'>
        <div className='grid grid-cols-12 gap-8 md:gap-12 lg:gap-16'>
          {/* Left Column: Sticky Header */}
          <div className='col-span-12 lg:col-span-3'>
            <div className='lg:sticky lg:top-20'>
              <p className='fade-up opacity-0 translate-y-4 transition-all duration-700 text-xs tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-4'>
                What I Bring
              </p>
              <h2 className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-100 text-3xl md:text-4xl font-light text-gray-900 dark:text-white leading-tight'>
                Capabilities
              </h2>
            </div>
          </div>

          {/* Right Column: Skills List */}
          <div className='col-span-12 lg:col-span-9'>
            <div className='space-y-0'>
          {skillCategories.map((category, index) => (
            <article 
              key={category.title}
              className='fade-up opacity-0 translate-y-4 transition-all duration-700'
              style={{ transitionDelay: `${150 + index * 100}ms` }}
            >
              {/* Divider */}
              <div className='h-px bg-gray-200 dark:bg-gray-800 mb-10 md:mb-12' />
              
              <div className='pb-12'>
                {/* Category number and title */}
                <div className='flex items-baseline gap-4 mb-4'>
                  <span className='text-sm font-mono text-gray-400 dark:text-gray-500'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                    {category.title}
                  </h3>
                </div>

                {/* Capability statement */}
                <p className='text-lg text-gray-700 dark:text-gray-300 mb-4 md:pl-10'>
                  {category.capability}
                </p>

                {/* Description */}
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed mb-6 md:pl-10'>
                  {category.description}
                </p>

                {/* Technologies - muted supporting text */}
                <p className='text-sm text-gray-400 dark:text-gray-500 md:pl-10'>
                  {category.technologies.join(' · ')}
                </p>
              </div>
            </article>
          ))}
          
              {/* Final divider */}
              <div className='fade-up opacity-0 translate-y-4 transition-all duration-700 delay-700 h-px bg-gray-200 dark:bg-gray-800' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


