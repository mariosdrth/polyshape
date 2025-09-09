
import { useMemo, Suspense } from 'react';
import { loadProjects } from '../../lib/projects';
import { AppRoutes } from '../../lib/common/AppRoutes';
import ItemList, { type Item } from '../../lib/common/ui/ItemList';
import { LoadingSpinnerFallback } from '../../lib/common/ui/spinner/LoadingSpinnerFallback';

function ProjectsInner() {
  const projects = useMemo(() => loadProjects(), []);
  return (
    <ItemList
      title={AppRoutes.PROJECTS.title}
      items={projects as unknown as Item[]}
      countLabel="projects"
      listAriaLabel="Project list"
      paginationAriaLabel="Projects pagination"
      getItemHref={(p) => `${AppRoutes.PROJECTS.path}/${p.pid}`}
    />
  );
}

export default function Projects() {
  return (
    <Suspense fallback={<LoadingSpinnerFallback />}> 
      <ProjectsInner />
    </Suspense>
  );
}
