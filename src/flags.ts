import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

/** Render the project ribbon as a perforated film reel (true) or as the plain curved cards (false). */
export const filmReel = flag<boolean>({
  key: 'film-reel',
  description: 'Render the project ribbon as a perforated film reel instead of plain cards',
  defaultValue: false,
  options: [
    { value: false, label: 'Off' },
    { value: true, label: 'On' },
  ],
  adapter: vercelAdapter,
});
