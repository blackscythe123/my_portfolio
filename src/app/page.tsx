import { AsciiCinematicPlayer } from '@/components/AsciiCinematicPlayer';
import { getAsciiPortfolioData } from '@/lib/ascii/portfolio';
import { buildAsciiScenes } from '@/lib/ascii/scenes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.simiyonvinscentsamuel.tech'),

  title: 'Simiyon Vinscent Samuel | ASCII Portfolio',
  description:
    'ASCII cinematic portfolio mode with passive autoplay scenes, fluid motion, and project highlights.',

  openGraph: {
    title: 'Simiyon Vinscent Samuel | ASCII Portfolio',
    description:
      'ASCII cinematic portfolio mode with passive autoplay scenes, fluid motion, and project highlights.',
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
    title: 'Simiyon Vinscent Samuel | ASCII Portfolio',
    description:
      'ASCII cinematic portfolio mode with passive autoplay scenes, fluid motion, and project highlights.',
    images: ['/thumbnail.png'],
  },
};

export default async function Home() {
  const portfolio = await getAsciiPortfolioData();
  const scenes = buildAsciiScenes(portfolio);

  return (
    <AsciiCinematicPlayer
      scenes={scenes}
      summaryLine={`${portfolio.name} portfolio in ascii cinematic mode with ${portfolio.repos.length} GitHub projects.`}
    />
  );
}
