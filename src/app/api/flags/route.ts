import { filmReel } from '../../../flags';

// The portfolio page is static HTML, so its scripts read flag values from here.
// A short shared cache keeps this cheap while a dashboard change still lands within about a minute.
export async function GET() {
  let film = false;
  try {
    film = await filmReel();
  } catch {
    film = false; // evaluation failed: serve the plain ribbon
  }
  return Response.json(
    { filmReel: film },
    { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=60' } },
  );
}
