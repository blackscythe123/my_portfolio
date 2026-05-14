'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Project {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  link: string;
  active: boolean;
  language: string;
  stars: number;
}

interface ProjectListProps {
  projects: Project[];
}

const ACCENTS = [
  {
    border: 'border-sodium',
    text: 'text-sodium',
    bg: 'bg-sodium',
    shadow: '4px 4px 0 #ffe83a',
    shadowHover: '8px 8px 0 #ffe83a',
    glow: 'rgba(255,232,58,0.4)',
  },
  {
    border: 'border-cherry',
    text: 'text-cherry',
    bg: 'bg-cherry',
    shadow: '4px 4px 0 #dc1c2e',
    shadowHover: '8px 8px 0 #dc1c2e',
    glow: 'rgba(220,28,46,0.4)',
  },
  {
    border: 'border-magenta',
    text: 'text-magenta',
    bg: 'bg-magenta',
    shadow: '4px 4px 0 #ff3d8a',
    shadowHover: '8px 8px 0 #ff3d8a',
    glow: 'rgba(255,61,138,0.4)',
  },
  {
    border: 'border-[#5be9ff]',
    text: 'text-[#5be9ff]',
    bg: 'bg-[#5be9ff]',
    shadow: '4px 4px 0 #5be9ff',
    shadowHover: '8px 8px 0 #5be9ff',
    glow: 'rgba(91,233,255,0.4)',
  },
];

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

  if (!projects || projects.length === 0) {
    return (
      <div className='text-center py-20'>
        <p className='font-mono text-bone/70 text-sm uppercase tracking-[0.18em] mb-6'>
          &middot; INDEX OFFLINE &middot;
        </p>
        <Link
          href='https://github.com/blackscythe123'
          target='_blank'
          rel='noopener noreferrer'
          className='zoku-play-pill'
        >
          <span>▶</span> SCOUT THE GITHUB
        </Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className='w-full'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
        {projects.map((project, index) => {
          const accent = ACCENTS[index % ACCENTS.length];
          const num = String(index + 1).padStart(2, '0');
          return (
            <motion.a
              key={project.title}
              href={project.link}
              target='_blank'
              rel='noopener noreferrer'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.05 + (index % 4) * 0.08,
              }}
              whileHover={{ y: -6 }}
              className={`group relative border-2 ${accent.border} bg-ink-deep/70 backdrop-blur-md p-4 flex flex-col gap-2 min-h-[220px] transition-shadow cursor-pointer no-underline`}
              style={{ boxShadow: accent.shadow }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = accent.shadowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = accent.shadow;
              }}
            >
              {/* active pip */}
              {project.active && (
                <span
                  className='absolute top-3 right-3 w-2 h-2 rounded-full bg-sodium'
                  style={{
                    boxShadow: '0 0 8px #ffe83a',
                    animation: 'h-pulse-pip 1.6s ease-in-out infinite',
                  }}
                />
              )}

              {/* big number */}
              <div
                className={`font-display font-extrabold ${accent.text} leading-[0.86] tracking-tight`}
                style={{ fontSize: 48 }}
              >
                {num}
              </div>

              {/* visual teaser */}
              <div
                className='h-14 relative overflow-hidden'
                style={{
                  background: `radial-gradient(circle at 40% 60%, ${accent.glow} 0%, transparent 60%), linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 60%)`,
                  opacity: 0.85,
                }}
              >
                <span
                  className={`absolute top-1 right-2 font-mono text-[10px] uppercase tracking-[0.18em] ${accent.text}`}
                >
                  &gt; {project.language}
                </span>
              </div>

              {/* title */}
              <h3 className='font-display font-extrabold uppercase text-bone text-[13px] leading-tight tracking-[0.04em] line-clamp-2'>
                {project.title}
              </h3>

              {/* description tiny */}
              <p className='font-sans text-bone/55 text-[11px] leading-snug line-clamp-2'>
                {project.description}
              </p>

              {/* meta */}
              <div className='mt-auto flex items-center justify-between'>
                <span className='font-mono text-[9px] tracking-[0.18em] uppercase text-bone/55'>
                  &#9733; {project.stars}
                </span>
                <span
                  className={`font-mono text-[9px] tracking-[0.22em] uppercase ${accent.text}`}
                >
                  {project.active ? '● LIVE' : 'ARCHIVE'}
                </span>
              </div>

              {/* play button */}
              <div
                className={`${accent.bg} text-ink-navy font-display font-extrabold text-center py-1.5 text-[10px] uppercase tracking-[0.22em] mt-1 group-hover:opacity-100 transition`}
              >
                ▶ PLAY
              </div>
            </motion.a>
          );
        })}
      </div>

      <div className='mt-12 flex justify-center'>
        <Link
          href='https://github.com/blackscythe123'
          target='_blank'
          rel='noopener noreferrer'
          className='font-mono text-xs uppercase tracking-[0.22em] text-bone/65 hover:text-sodium transition flex items-center gap-2 border-b border-bone/20 hover:border-sodium pb-1'
        >
          VIEW ALL ON GITHUB <span className='text-sodium'>↗</span>
        </Link>
      </div>
    </div>
  );
}
