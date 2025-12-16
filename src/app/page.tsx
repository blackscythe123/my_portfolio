
import {
  Hero,
  Navigation,
  Skills,
  Projects,
  Contact,
} from '@/components';

export default function Home() {
  return (
    <main className='min-h-screen bg-background relative overflow-x-hidden'>
      {/* Decorative background layers */}
      <div aria-hidden='true' className='pointer-events-none fixed inset-0 -z-10'>
        <div className='absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background' />
        <div className='absolute -top-56 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl' />
        <div className='absolute -bottom-64 left-1/3 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl' />
      </div>

      <Navigation />
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}

