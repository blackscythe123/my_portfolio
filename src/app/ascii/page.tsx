import { AsciiCinematicPlayer } from '@/components/AsciiCinematicPlayer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ASCII Cinematic Mode | Simiyon Vinscent Samuel',
  description:
    'A passive autoplay ASCII cinematic mode presenting Simiyon Vinscent Samuel\'s portfolio as a fluid loading-video experience.',
};

export default function AsciiPage() {
  return <AsciiCinematicPlayer />;
}
