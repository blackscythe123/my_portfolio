import { createFlagsDiscoveryEndpoint } from 'flags/next';
import { getProviderData } from '@flags-sdk/vercel';
import * as flags from '../../../../flags';

// Lets the Vercel Toolbar's Flags Explorer list and override this project's flags.
export const GET = createFlagsDiscoveryEndpoint(async () => {
  return getProviderData(flags);
});
