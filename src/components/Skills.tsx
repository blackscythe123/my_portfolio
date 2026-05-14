'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Clan {
  index: string;
  name: string;
  accent: 'sodium' | 'cherry' | 'magenta';
  borderClass: string;
  textClass: string;
  shadowClass: string;
  techs: string[];
}

const clans: Clan[] = [
  {
    index: 'CLAN 01',
    name: 'AUTOMATION',
    accent: 'sodium',
    borderClass: 'border-sodium',
    textClass: 'text-sodium',
    shadowClass: 'zoku-comic-shadow-sodium',
    techs: ['Python', 'n8n', 'Zapier', 'AI Studios', 'FastAPI'],
  },
  {
    index: 'CLAN 02',
    name: 'WEB3 / SOL',
    accent: 'cherry',
    borderClass: 'border-cherry',
    textClass: 'text-cherry',
    shadowClass: 'zoku-comic-shadow-cherry',
    techs: ['Solidity', 'Web3', 'Smart Contracts', 'Wallets', 'Hardhat'],
  },
  {
    index: 'CLAN 03',
    name: 'FULL·STACK',
    accent: 'magenta',
    borderClass: 'border-magenta',
    textClass: 'text-magenta',
    shadowClass: 'zoku-comic-shadow-magenta',
    techs: ['React', 'Next.js', 'Node', 'Supabase', 'TypeScript'],
  },
];

export function Skills() {
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = ref.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={ref}
      className="zoku-section bg-ink relative overflow-hidden flex items-center justify-center py-24"
    >
      {/* painterly horizon */}
      <div
        className="absolute left-0 right-0 top-0 h-1/2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 800px 280px at 28% 60%, rgba(220,28,46,0.55), transparent 70%), radial-gradient(ellipse 600px 220px at 72% 36%, rgba(255,61,138,0.4), transparent 70%)',
          filter: 'blur(0.5px)',
        }}
      />

      {/* grain */}
      <div className="zoku-grain absolute inset-0 pointer-events-none opacity-40" />

      {/* power lines */}
      <svg
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        className="absolute top-1/4 left-[4%] right-[4%] h-1/2 z-10 pointer-events-none"
        style={{ width: '92%' }}
      >
        <line x1="80" y1="0" x2="80" y2="200" stroke="#0a0a0a" strokeWidth={1.6} fill="none" />
        <line x1="520" y1="0" x2="520" y2="200" stroke="#0a0a0a" strokeWidth={1.6} fill="none" />
        <line x1="0" y1="60" x2="600" y2="78" stroke="#0a0a0a" strokeWidth={1.4} fill="none" />
        <line x1="0" y1="110" x2="600" y2="120" stroke="#0a0a0a" strokeWidth={1.4} fill="none" />
        <line x1="0" y1="160" x2="600" y2="150" stroke="#0a0a0a" strokeWidth={1.4} fill="none" />
      </svg>

      {/* hooded silhouette */}
      <div className="absolute left-[14%] bottom-[26%] w-16 h-28 flex flex-col items-center z-20 pointer-events-none">
        <div
          className="w-7 h-7 rounded-full bg-ink-deep border-2 border-sodium"
          style={{ boxShadow: '0 0 10px rgba(220,28,46,0.6)' }}
        />
        <div
          className="w-[60px] h-20 -mt-1"
          style={{
            background:
              'linear-gradient(180deg, #ffe83a 0%, #dc1c2e 55%, #06112a 100%)',
            clipPath: 'polygon(22% 0, 78% 0, 100% 70%, 88% 100%, 12% 100%, 0 70%)',
            filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.5))',
          }}
        />
      </div>

      {/* Tokyo vending machine */}
      <div
        className="absolute right-[12%] bottom-[24%] z-20 pointer-events-none bg-ink border-2 border-sodium zoku-comic-shadow-cherry"
        style={{ width: 88, height: 128 }}
      >
        <div
          className="bg-sodium text-ink font-display font-extrabold text-center"
          style={{ fontSize: 9, padding: '3px 0', letterSpacing: '0.08em' }}
        >
          T&#332;KY&#376; VEND
        </div>
        <div className="grid grid-cols-2 gap-[3px] p-[4px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4"
              style={{
                background: 'linear-gradient(135deg, #dc1c2e, #ff3d8a)',
                border: '1px solid rgba(0,0,0,0.4)',
              }}
            />
          ))}
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-[14px] bg-ink-deep"
          style={{ borderTop: '2px solid #ffe83a' }}
        />
      </div>

      {/* center heading + body */}
      <div className="relative z-30 flex flex-col items-center w-full">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto px-6"
        >
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-bone/60 mb-3">
            CHAPTER 01 &middot; THE STACK
          </p>
          <h2
            className="font-display font-extrabold uppercase text-bone text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight"
            style={{ textShadow: '4px 4px 0 #dc1c2e, 8px 8px 0 rgba(0,0,0,0.4)' }}
          >
            PICK YOUR{' '}
            <em
              className="not-italic text-sodium italic"
              style={{ textShadow: '4px 4px 0 #0a0a0a' }}
            >
              STACK
            </em>
          </h2>
          <p className="font-display font-bold tracking-[0.32em] uppercase text-bone/70 mt-4 text-xs md:text-sm">
            three clans &middot; one engineer &middot; pick a side
          </p>
        </motion.header>

        {/* clan cards */}
        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center items-stretch max-w-4xl mx-auto px-6 w-full">
          {clans.map((clan, idx) => (
            <motion.article
              key={clan.name}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              style={{ transitionDelay: `${idx * 80}ms` }}
              className={`relative w-full md:w-[200px] min-h-[220px] border-2 ${clan.borderClass} ${clan.shadowClass} bg-ink/72 backdrop-blur-md p-[18px] cursor-pointer flex flex-col`}
            >
              <p className={`font-mono text-[10px] tracking-[0.3em] uppercase ${clan.textClass} mb-2`}>
                {clan.index}
              </p>
              <h3
                className={`font-display font-extrabold uppercase text-2xl leading-none tracking-tight ${clan.textClass} mb-4`}
              >
                {clan.name}
              </h3>
              <ul className="mt-auto space-y-1.5">
                {clan.techs.map((tech) => (
                  <li
                    key={tech}
                    className="font-mono text-[11px] text-bone/85 flex items-center gap-2"
                  >
                    <span className={`inline-block w-1.5 h-1.5 ${clan.textClass.replace('text-', 'bg-')}`} />
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        {/* closing paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-12 max-w-2xl mx-auto text-center px-6"
        >
          <p className="font-sans text-bone/70 text-base md:text-lg leading-relaxed">
            Three sides. One engineer. Pick one to dive in &mdash; or pick all three and remix. The systems I ship use any combination of the above.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
