import { fetchGitHubRepos } from '@/lib/github';
import { ProjectList } from './ProjectList';

export async function Projects() {
  const repos = await fetchGitHubRepos('blackscythe123');

  const projects = repos.slice(0, 8).map((repo) => ({
    title: repo.name,
    subtitle: repo.language || 'Project',
    description: repo.description || 'No description.',
    tags: [repo.language, ...repo.topics].filter(Boolean) as string[],
    link: repo.html_url,
    active:
      new Date(repo.pushed_at).getTime() >
      Date.now() - 30 * 24 * 60 * 60 * 1000,
    language: repo.language || 'Multi',
    stars: repo.stargazers_count,
  }));

  return (
    <section
      id='projects'
      className='zoku-section bg-ink-navy relative overflow-hidden flex flex-col items-center justify-center py-24'
      style={{
        background:
          'radial-gradient(ellipse 1100px 600px at 50% 110%, #142348 0%, #0e1b3a 50%, #06112a 100%)',
      }}
    >
      {/* corner painterly accents */}
      <div
        className='absolute top-0 right-0 w-[280px] h-[280px] pointer-events-none opacity-50'
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(220,28,46,0.5), transparent 60%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        className='absolute bottom-0 left-0 w-[280px] h-[280px] pointer-events-none opacity-40'
        style={{
          background:
            'radial-gradient(circle at 20% 80%, rgba(255,61,138,0.4), transparent 60%)',
          filter: 'blur(20px)',
        }}
      />

      <header className='relative z-10 text-center max-w-3xl mx-auto px-6 mb-14'>
        <p className='font-mono text-[11px] tracking-[0.3em] uppercase text-bone/55 mb-3'>
          CHAPTER 03 &middot; THE INDEX
        </p>
        <h2
          className='font-display font-extrabold uppercase text-bone text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight'
          style={{ textShadow: '4px 4px 0 #dc1c2e, 8px 8px 0 rgba(0,0,0,0.45)' }}
        >
          PICK A SYSTEM.{' '}
          <em
            className='not-italic text-sodium italic'
            style={{ textShadow: '4px 4px 0 #0a0a0a' }}
          >
            START IT UP.
          </em>
        </h2>
        <p className='font-mono text-xs tracking-[0.32em] uppercase text-bone/55 mt-5'>
          {projects.length || 0} shipped systems &middot; open the archive &rarr;
        </p>
      </header>

      <div className='relative z-10 w-full max-w-7xl px-6'>
        <ProjectList projects={projects} />
      </div>
    </section>
  );
}
