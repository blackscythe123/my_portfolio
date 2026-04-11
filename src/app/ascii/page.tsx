import { AsciiCinematicPlayer } from '@/components/AsciiCinematicPlayer';
import { getAsciiPortfolioData } from '@/lib/ascii/portfolio';
import { buildAsciiScenes } from '@/lib/ascii/scenes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ASCII Cinematic Mode | Simiyon Vinscent Samuel',
  description:
    'A passive autoplay ASCII cinematic mode presenting Simiyon Vinscent Samuel\'s portfolio as a fluid loading-video experience.',
};

export default async function AsciiPage() {
  const portfolio = await getAsciiPortfolioData();
  const scenes = buildAsciiScenes(portfolio);

  return (
    <AsciiCinematicPlayer
      scenes={scenes}
      summaryLine={`${portfolio.name} portfolio in ascii cinematic mode with ${portfolio.repos.length} GitHub projects.`}
    />
  );
}
