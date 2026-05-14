'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse parallax — track normalized 0..1 across the section,
  // then map to a small +/- px translation on the wordmark.
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rawX = useTransform(mouseX, [0, 1], [-14, 14]);
  const rawY = useTransform(mouseY, [0, 1], [-8, 8]);
  // Spring-smooth so the wordmark doesn't snap with each event.
  const wordmarkX = useSpring(rawX, { stiffness: 90, damping: 18, mass: 0.6 });
  const wordmarkY = useSpring(rawY, { stiffness: 90, damping: 18, mass: 0.6 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    section.addEventListener('mousemove', handleMove);
    return () => section.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="zoku-section flex items-center justify-center bg-ink relative overflow-hidden"
    >
      {/* === PAINTERLY CLOUD BLOBS (z-1) === */}
      <div
        className="cloud-blob animate-h-drift-l absolute z-[1] pointer-events-none"
        style={{ width: 520, height: 520, top: -60, left: -120 }}
        aria-hidden
      >
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="h-full w-full">
          <path
            fill="#dc1c2e"
            d="M40,80 C20,60 30,30 60,30 C70,10 110,10 120,30 C150,20 180,50 170,80 C190,90 180,130 150,130 C140,160 100,170 80,150 C50,160 20,130 40,100 Z"
          />
          <path
            fill="#ff3d8a"
            opacity="0.6"
            d="M60,90 C45,75 60,55 80,55 C90,45 115,45 120,60 C140,55 155,80 145,95 C155,115 130,135 110,125 C90,140 65,125 60,105 Z"
          />
        </svg>
      </div>

      <div
        className="cloud-blob animate-h-drift-r absolute z-[1] pointer-events-none"
        style={{ width: 540, height: 540, bottom: -120, right: -120 }}
        aria-hidden
      >
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="h-full w-full">
          <path
            fill="#dc1c2e"
            d="M50,90 C30,70 40,40 70,40 C80,20 120,20 130,40 C155,30 185,60 170,90 C190,105 175,140 145,135 C135,165 95,170 75,150 C45,155 20,125 50,100 Z"
          />
          <path
            fill="#ff3d8a"
            opacity="0.55"
            d="M70,100 C55,85 70,65 90,68 C100,55 125,55 130,72 C150,68 165,90 150,105 C160,125 135,140 115,130 C95,145 70,130 65,110 Z"
          />
        </svg>
      </div>

      <div
        className="cloud-blob animate-h-drift-b absolute z-[1] pointer-events-none opacity-60"
        style={{ width: 360, height: 360, bottom: -240, left: '20%' }}
        aria-hidden
      >
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="h-full w-full">
          <path
            fill="#dc1c2e"
            d="M40,100 C25,80 40,55 70,60 C80,40 120,40 130,60 C160,55 175,85 160,105 C175,125 150,150 125,140 C105,155 75,145 65,125 C40,130 25,115 40,100 Z"
          />
        </svg>
      </div>

      {/* === MAGENTA STAR BURSTS (z-2) === */}
      <span
        className="absolute z-[2] pointer-events-none animate-h-spin-fast"
        style={{ top: '22%', left: '12%', width: 60, height: 60 }}
        aria-hidden
      >
        <svg
          viewBox="-50 -50 100 100"
          className="h-full w-full"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,61,138,0.5))' }}
        >
          <polygon
            points="0,-40 9,-12 38,-12 14,5 23,32 0,15 -23,32 -14,5 -38,-12 -9,-12"
            fill="#ff3d8a"
          />
        </svg>
      </span>

      <span
        className="absolute z-[2] pointer-events-none animate-h-spin-slow"
        style={{ top: '68%', right: '18%', width: 40, height: 40 }}
        aria-hidden
      >
        <svg
          viewBox="-50 -50 100 100"
          className="h-full w-full"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,61,138,0.5))' }}
        >
          <polygon
            points="0,-40 9,-12 38,-12 14,5 23,32 0,15 -23,32 -14,5 -38,-12 -9,-12"
            fill="#ff3d8a"
          />
        </svg>
      </span>

      <span
        className="absolute z-[2] pointer-events-none animate-h-spin-fast"
        style={{ top: '12%', right: '10%', width: 32, height: 32 }}
        aria-hidden
      >
        <svg
          viewBox="-50 -50 100 100"
          className="h-full w-full"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,61,138,0.5))' }}
        >
          <polygon
            points="0,-40 9,-12 38,-12 14,5 23,32 0,15 -23,32 -14,5 -38,-12 -9,-12"
            fill="#ff3d8a"
          />
        </svg>
      </span>

      {/* === FILM GRAIN OVERLAY === */}
      <div className="zoku-grain absolute inset-0 pointer-events-none z-[3]" aria-hidden />

      {/* === MAIN CONTENT === */}
      <div className="relative z-10 max-w-5xl text-center flex flex-col items-center gap-4 px-6">
        {/* overline — sodium horizontal flank lines via spans */}
        <div className="flex items-center gap-3.5">
          <span
            aria-hidden
            className="block h-px w-9"
            style={{
              background: 'linear-gradient(90deg, transparent, #ffe83a)',
              boxShadow: '0 0 8px rgba(255,232,58,0.5)',
            }}
          />
          <p className="font-sans font-bold uppercase tracking-[0.3em] text-sodium text-[11px] md:text-xs">
            A MULTIMEDIA ENGINEER &middot; CHENNAI &middot; &apos;26
          </p>
          <span
            aria-hidden
            className="block h-px w-9"
            style={{
              background: 'linear-gradient(90deg, #ffe83a, transparent)',
              boxShadow: '0 0 8px rgba(255,232,58,0.5)',
            }}
          />
        </div>

        {/* wavy wordmark — parallax via framer-motion */}
        <motion.h1
          className="zoku-wordmark"
          style={{ x: wordmarkX, y: wordmarkY }}
        >
          SIMIYON
        </motion.h1>

        {/* tag */}
        <p className="font-display font-bold uppercase tracking-[0.3em] text-bone text-xs md:text-sm mt-2">
          BUILD YOUR SYSTEM.{' '}
          <em className="not-italic text-sodium [text-shadow:0_0_18px_rgba(255,232,58,0.6)]">
            TAKE A SIDE.
          </em>
        </p>

        {/* CTA */}
        <div className="flex gap-4 mt-6">
          <Link href="#projects" className="zoku-play-pill">
            OPEN THE INDEX <span>▶</span>
          </Link>
        </div>
      </div>

      {/* === PORTRAIT INSET CARD === */}
      <div
        className="absolute z-20 zoku-comic-shadow-cherry hidden md:block"
        style={{
          bottom: 128,
          left: 80,
          width: 110,
          height: 140,
          border: '2px solid #ffe83a',
          background: 'linear-gradient(180deg, #dc1c2e 0%, #5a1230 40%, #0e1b3a 100%)',
          overflow: 'hidden',
        }}
      >
        <Image
          src="https://github.com/blackscythe123.png"
          alt="Simiyon"
          width={130}
          height={170}
          unoptimized
          className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-90"
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-sodium text-ink font-display font-extrabold uppercase tracking-[0.14em]"
          style={{
            bottom: 8,
            padding: '4px 8px',
            fontSize: 9,
            zIndex: 2,
          }}
        >
          SVS &middot; 01
        </div>
      </div>

      {/* === DIAGONAL SLICE LINE === */}
      <div
        className="zoku-slice absolute z-[5]"
        style={{ left: -50, right: -50, bottom: 128 }}
        aria-hidden
      />

      {/* === SCROLL HINT === */}
      <p className="absolute bottom-16 left-1/2 -translate-x-1/2 font-display font-bold tracking-[0.3em] uppercase text-bone/70 text-[10px] animate-h-bob z-10">
        SCROLL TO ENTER <span className="text-sodium">↓</span>
      </p>
    </section>
  );
}
