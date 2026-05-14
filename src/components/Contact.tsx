'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const SOCIALS = [
  { label: 'G', title: 'GitHub', href: 'https://github.com/blackscythe123' },
  {
    label: 'in',
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/in/simiyonvinscentsamuel/',
  },
  { label: 'x', title: 'X / Twitter', href: '#' },
  { label: 'D', title: 'Discord', href: '#' },
];

export function Contact() {
  const ref = useRef<HTMLElement>(null);

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
    const elements = ref.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      id='contact'
      className='zoku-section relative overflow-hidden flex flex-col items-center justify-center py-24 px-6'
      style={{
        minHeight: '80vh',
        background:
          'radial-gradient(ellipse 1000px 500px at 50% 0%, rgba(220,28,46,0.18), transparent 60%),' +
          'radial-gradient(ellipse 700px 350px at 50% 100%, rgba(255,232,58,0.10), transparent 60%),' +
          '#06112a',
      }}
    >
      {/* corner stars */}
      <span
        className='absolute pointer-events-none z-[2] animate-h-spin-slow'
        style={{ top: '12%', left: '8%', width: 40, height: 40 }}
        aria-hidden
      >
        <svg viewBox='-50 -50 100 100' className='h-full w-full'>
          <polygon
            points='0,-40 9,-12 38,-12 14,5 23,32 0,15 -23,32 -14,5 -38,-12 -9,-12'
            fill='#ff3d8a'
          />
        </svg>
      </span>
      <span
        className='absolute pointer-events-none z-[2] animate-h-spin-fast'
        style={{ bottom: '14%', right: '10%', width: 32, height: 32 }}
        aria-hidden
      >
        <svg viewBox='-50 -50 100 100' className='h-full w-full'>
          <polygon
            points='0,-40 9,-12 38,-12 14,5 23,32 0,15 -23,32 -14,5 -38,-12 -9,-12'
            fill='#ffe83a'
          />
        </svg>
      </span>

      <div className='relative z-10 max-w-3xl w-full text-center flex flex-col items-center gap-6'>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className='font-mono text-[11px] tracking-[0.3em] uppercase text-bone/55 flex items-center gap-3'
        >
          <span className='block w-7 h-px bg-cherry' />
          CHAPTER 04 &middot; REACH
          <span className='block w-7 h-px bg-cherry' />
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className='font-display font-extrabold uppercase text-bone text-4xl md:text-5xl lg:text-6xl leading-none tracking-tight'
          style={{ textShadow: '4px 4px 0 #dc1c2e, 8px 8px 0 rgba(0,0,0,0.45)' }}
        >
          WANT IN ON{' '}
          <em
            className='not-italic text-sodium italic'
            style={{ textShadow: '4px 4px 0 #0a0a0a' }}
          >
            THE SAGA?
          </em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className='font-sans text-bone/75 text-base md:text-lg leading-relaxed max-w-xl'
        >
          Open commissions. Automation &middot; web3 &middot; full-stack. Drop a transmission &mdash; I read every signal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className='mt-4'
        >
          <Link
            href='mailto:samsamuel234567@gmail.com'
            className='zoku-play-pill'
            style={{ fontSize: 14 }}
          >
            <span>▶</span> SEND A TRANSMISSION
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='font-mono text-xs tracking-[0.14em] uppercase text-bone/55 break-all md:break-normal'
        >
          samsamuel234567@gmail.com
        </motion.p>

        {/* social row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className='flex gap-3 mt-2'
        >
          {SOCIALS.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              target='_blank'
              rel='noopener noreferrer'
              title={s.title}
              className='w-12 h-12 rounded-full border-2 border-bone/25 flex items-center justify-center font-display font-extrabold text-bone hover:bg-sodium hover:text-ink-navy hover:border-sodium hover:-translate-y-1 transition'
              style={{ boxShadow: '3px 3px 0 rgba(220,28,46,0.4)' }}
            >
              {s.label}
            </Link>
          ))}
        </motion.div>

        {/* divider */}
        <div className='zoku-slice w-full max-w-md mt-10' />

        {/* footer credits */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className='font-mono text-[10px] tracking-[0.22em] uppercase text-bone/45 mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2'
        >
          <span>&copy; 2026 SIMIYON VINSCENT SAMUEL L.</span>
          <span>BUILT IN CHENNAI</span>
          <span>
            SITE BY <em className='not-italic text-sodium'>S.V.S</em>
          </span>
        </motion.p>
      </div>
    </footer>
  );
}
