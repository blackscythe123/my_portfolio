import { fetchGitHubRepos } from '@/lib/github';
import { ProjectList } from './ProjectList';

export async function Projects() {
  const repos = await fetchGitHubRepos('blackscythe123');
  
  // Filter and map repositories to the project format
  // We'll take the top 6 repositories
  const projects = repos.slice(0, 6).map(repo => ({
    title: repo.name,
    subtitle: repo.language || 'Project',
    description: repo.description || 'No description available.',
    tags: [repo.language, ...repo.topics].filter(Boolean) as string[],
    link: repo.html_url,
    active: new Date(repo.pushed_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 // Active if pushed in last 30 days
  }));

  return (
    <section id='projects' className='py-20 md:py-32 bg-white dark:bg-[#0a0a0a]'>
      <div className='w-full px-6 md:px-8 lg:px-12'>
        {/* Section Header - centered, narrow column */}
        <header className='max-w-2xl mx-auto mb-16 md:mb-24'>
          <p className='text-xs md:text-sm tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-4'>
            Selected Work
          </p>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white leading-tight mb-6'>
            Projects that showcase my approach to <span className='font-semibold'>problem-solving</span> and technical execution.
          </h2>
          <p className='text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed'>
            Each project represents a unique challenge—from automation scripts to full-stack applications. Click through to explore the code and implementation details.
          </p>
        </header>
        
        {/* Projects Grid - full width */}
        <div className='max-w-7xl mx-auto'>
          <ProjectList projects={projects} />
        </div>
      </div>
    </section>
  );
}

