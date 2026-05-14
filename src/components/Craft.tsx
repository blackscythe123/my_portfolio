'use client';

import { motion } from 'framer-motion';

export function Craft() {
  return (
    <section
      id='craft'
      className='zoku-section relative overflow-hidden flex items-center justify-center py-32'
      style={{
        background:
          'radial-gradient(circle at 50% 50%, #ff5c9a 0%, #ff3d8a 35%, #a01258 90%)',
      }}
    >
      {/* diagonal stripes overlay */}
      <div
        className='absolute inset-0 pointer-events-none z-10'
        style={{
          background:
            'repeating-linear-gradient(45deg, transparent 0, transparent 36px, rgba(0,0,0,0.06) 36px, rgba(0,0,0,0.06) 40px)',
        }}
      />

      {/* big black star burst, rotating */}
      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] z-20 animate-s4-spin pointer-events-none'>
        <svg viewBox='-150 -150 300 300' className='w-full h-full'>
          <polygon
            points='0,-130 30,-40 130,-40 50,15 80,110 0,55 -80,110 -50,15 -130,-40 -30,-40'
            fill='#0a0a0a'
            opacity={0.85}
          />
        </svg>
      </div>

      {/* stickers */}
      <motion.span
        initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -10 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className='absolute right-[16%] top-[20%] px-3.5 py-2 bg-sodium text-char font-display font-extrabold text-sm uppercase tracking-wider z-30'
        style={{ boxShadow: '4px 4px 0 #0a0a0a' }}
      >
        + INFINITE
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 8 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
        className='absolute right-[28%] bottom-[22%] px-3.5 py-2 bg-bone text-char font-display font-extrabold text-sm uppercase tracking-wider z-30'
        style={{ boxShadow: '4px 4px 0 #0a0a0a' }}
      >
        YOUR WAY &rarr;
      </motion.span>

      {/* anime character (pure CSS) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className='relative z-30 w-52 h-72 flex flex-col items-center'
      >
        {/* horns */}
        <div className='relative w-28 h-9'>
          <div
            className='absolute bottom-0 w-6 h-9 -rotate-12'
            style={{
              left: '16%',
              background: 'linear-gradient(180deg, #f4ede1, #ddd5c5)',
              clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
            }}
          />
          <div
            className='absolute bottom-0 w-6 h-9 rotate-12'
            style={{
              right: '16%',
              background: 'linear-gradient(180deg, #f4ede1, #ddd5c5)',
              clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
            }}
          />
        </div>
        {/* head */}
        <div
          className='relative w-[84px] h-[84px] rounded-full -mt-2'
          style={{
            background: 'linear-gradient(180deg, #f4ede1 60%, #ddd5c5)',
            boxShadow: '0 8px 14px rgba(0,0,0,0.35)',
          }}
        >
          <div
            className='absolute bg-char rounded-full'
            style={{
              left: '14%',
              top: '38%',
              width: '72%',
              height: '14%',
              boxShadow: '0 0 8px rgba(0,0,0,0.5)',
            }}
          />
        </div>
        {/* body */}
        <div
          className='relative w-36 h-[170px] -mt-1.5'
          style={{
            background:
              'linear-gradient(180deg, #f4ede1 0%, #ddd5c5 30%, #b8a690 100%)',
            clipPath:
              'polygon(15% 0, 85% 0, 100% 35%, 92% 100%, 8% 100%, 0 35%)',
            filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.35))',
          }}
        >
          {/* katana strap */}
          <div
            className='absolute w-[3px] rounded-sm rotate-[8deg]'
            style={{
              right: '12%',
              top: '10%',
              height: '80%',
              background: 'linear-gradient(180deg, #c0c0c0, #808080)',
              boxShadow: '0 0 4px rgba(0,0,0,0.4)',
            }}
          />
        </div>
      </motion.div>

      {/* left content */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className='absolute left-8 md:left-20 top-1/2 -translate-y-1/2 max-w-sm z-40 pr-6'
      >
        <p className='font-display font-extrabold uppercase tracking-[0.3em] text-bone text-xs flex items-center gap-3.5 mb-5'>
          <span className='block w-7 h-px bg-bone' />
          CHAPTER 02 &middot; CRAFT
        </p>
        <h2
          className='font-display font-extrabold uppercase text-char text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tight'
          style={{ textShadow: '4px 4px 0 #f4ede1, 8px 8px 0 rgba(220,28,46,0.5)' }}
        >
          CRAFT YOUR{' '}
          <em
            className='italic text-bone'
            style={{ textShadow: '4px 4px 0 #0a0a0a' }}
          >
            SYSTEM
          </em>
        </h2>
        <p className='mt-4 font-display font-semibold uppercase tracking-[0.22em] text-bone/90 text-xs'>
          5+ shipped systems &middot; infinite combinations &middot; pick the parts
        </p>
      </motion.div>
    </section>
  );
}
