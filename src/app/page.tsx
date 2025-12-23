import {
  Hero,
  Navigation,
  Skills,
  Projects,
  Contact,
} from '@/components';
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
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      <Navigation />
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}
