import { FluidAsciiSmoke } from '@/components/FluidAsciiSmoke';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.simiyonvinscentsamuel.tech'),

  title: 'Simiyon Vinscent Samuel | Portfolio',
  description:
    'I build intelligent systems at the intersection of automation, web3, and full-stack development.',

  openGraph: {
    title: 'Simiyon Vinscent Samuel | Portfolio',
    description:
      'I build intelligent systems at the intersection of automation, web3, and full-stack development.',
    url: '/',
    siteName: 'Simiyon Portfolio',
    images: [
      {
        url: '/thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Simiyon Portfolio Preview',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Simiyon Vinscent Samuel | Portfolio',
    description:
      'I build intelligent systems at the intersection of automation, web3, and full-stack development.',
    images: ['/thumbnail.png'],
  },
};

export default function Home() {
  return (
    <main id='top' className='portfolio-root'>
      <FluidAsciiSmoke />
      <div aria-hidden='true' className='ambient-overlay' />

      <header className='floating-nav'>
        <a href='#top' className='brand-mark'>
          Simiyon
        </a>
        <nav aria-label='Primary' className='main-nav'>
          <a href='#work'>Work</a>
          <a href='#systems'>Systems</a>
          <a href='#contact'>Contact</a>
        </nav>
      </header>

      <div className='content-rail'>
        <section className='glass-panel hero-panel'>
          <p className='panel-kicker'>Automation · Web3 · Full-stack</p>
          <h1>Building fluid digital systems with precision and personality.</h1>
          <p>
            I design and ship products that connect intelligent automation, protocol-aware engineering,
            and thoughtful interface craft.
          </p>
          <div className='hero-actions'>
            <a href='#work' className='btn-primary'>
              Explore Work
            </a>
            <a href='mailto:simiyonvinscentsamuel@gmail.com' className='btn-secondary'>
              Start a Conversation
            </a>
          </div>
        </section>

        <section id='work' className='glass-panel split-panel'>
          <div>
            <p className='panel-kicker'>Selected Work</p>
            <h2>From one-off scripts to production-ready systems.</h2>
          </div>
          <div className='tile-grid'>
            <article>
              <h3>Automation Pipelines</h3>
              <p>
                Built high-reliability task flows for repetitive operational work, reducing friction and
                increasing consistency for teams.
              </p>
            </article>
            <article>
              <h3>Protocol & Web3 Experiments</h3>
              <p>
                Prototyped smart-contract aware apps and integration surfaces where data trust and UX both
                matter.
              </p>
            </article>
            <article>
              <h3>Full-stack Products</h3>
              <p>
                Shipped modern web products with strong attention to code architecture, responsiveness,
                and maintainability.
              </p>
            </article>
          </div>
        </section>

        <section id='systems' className='glass-panel split-panel'>
          <div>
            <p className='panel-kicker'>Core Systems</p>
            <h2>The toolkit behind the output.</h2>
          </div>
          <div className='stack-lines'>
            <p>
              <span>Languages</span>
              TypeScript · JavaScript · Solidity · Python
            </p>
            <p>
              <span>Frameworks</span>
              Next.js · React · Node.js · Express
            </p>
            <p>
              <span>Practices</span>
              API design · automation architecture · performance-focused UI engineering
            </p>
          </div>
        </section>

        <section id='contact' className='glass-panel contact-panel'>
          <p className='panel-kicker'>Contact</p>
          <h2>Let&apos;s build something distinct.</h2>
          <p>
            If you are working on ambitious automation or product ideas, I can help design and implement
            the system end-to-end.
          </p>
          <div className='contact-links'>
            <a href='mailto:simiyonvinscentsamuel@gmail.com'>Email</a>
            <a href='https://github.com' target='_blank' rel='noreferrer'>
              GitHub
            </a>
            <a href='https://www.linkedin.com' target='_blank' rel='noreferrer'>
              LinkedIn
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
