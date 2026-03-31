import {
  Navigation,
} from '@/components';
import { StorySection } from '@/components/StorySection';
import { WalkingBoyCharacter } from '@/components/WalkingBoyCharacter';
import { storyActs } from '@/data/story-acts';
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
    <main className='relative min-h-screen overflow-x-hidden bg-background'>
      <Navigation />
      <WalkingBoyCharacter />
      {storyActs.map((act, index) => (
        <StorySection key={act.id} act={act} index={index} />
      ))}
    </main>
  );
}
