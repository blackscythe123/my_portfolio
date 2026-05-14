'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

export function Notes() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      id='notes'
      className='zoku-section bg-bone text-char relative overflow-hidden flex items-center'
      style={{ padding: '8rem 12% 8rem 16%' }}
    >
      {/* paper grain (multiply blend) */}
      <div
        className='absolute inset-0 pointer-events-none'
        style={{
          mixBlendMode: 'multiply',
          opacity: 0.45,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n3'><feTurbulence baseFrequency='0.85' numOctaves='3' seed='5'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0.14 0'/></filter><rect width='160' height='160' filter='url(%23n3)'/></svg>\")",
        }}
      />

      {/* chapter tab */}
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className='absolute top-24 font-mono text-[11px] uppercase tracking-[0.32em] text-char/55 flex items-center gap-3.5 z-10'
        style={{ left: '16%' }}
      >
        <span className='block w-8 h-px bg-cherry' />
        CHAPTER 01 &middot; THE STACK
      </motion.p>

      {/* narrative caption */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className='font-display font-extrabold italic text-2xl md:text-4xl lg:text-5xl leading-[1.18] tracking-tight max-w-4xl z-10 text-char'
      >
        <em
          className='not-italic text-cherry'
          style={{
            background: 'linear-gradient(180deg, transparent 60%, rgba(255,232,58,0.6) 60%)',
            padding: '0 4px',
          }}
        >
          The stack of T&#333;dai
        </em>{' '}
        was a blooming metropolis. Noisy and crowded, yet the kind of place you fall in love with. After the events of &apos;24, parts of it got torn apart and almost wiped. Now{' '}
        <em
          className='not-italic text-cherry'
          style={{
            background: 'linear-gradient(180deg, transparent 60%, rgba(255,232,58,0.6) 60%)',
            padding: '0 4px',
          }}
        >
          rebuilt to its former glory
        </em>
        , thus begins the Simiyon saga.
      </motion.p>

      {/* portrait inset right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className='hidden md:block absolute top-1/2 -translate-y-1/2 w-32 h-44 border-2 border-char z-10'
        style={{
          right: '12%',
          background: 'linear-gradient(180deg, #dc1c2e 0%, #6a0e1f 100%)',
          boxShadow: '5px 5px 0 #ffe83a, 10px 10px 0 #0a0a0a',
        }}
      >
        <div
          className='absolute inset-2'
          style={{
            background:
              'radial-gradient(circle at 50% 28%, #f4ede1 14%, transparent 16%), linear-gradient(180deg, transparent 30%, #0a0a0a 32%, #0a0a0a 100%)',
          }}
        />
      </motion.div>

      {/* footer line */}
      <p
        className='absolute bottom-20 font-mono text-[10px] tracking-[0.32em] uppercase text-char/55 z-10'
        style={{ left: '16%' }}
      >
        A SAGA IN FIVE PARTS &middot; READ INSIDE
      </p>
    </section>
  );
}
