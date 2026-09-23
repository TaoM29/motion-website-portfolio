import Home from '../app/page';
import { ProjectPage, NotFound } from '../app/project-page';
import { projectForPath } from '../app/site';

export default function App({ path }: { path: string }) {
  if (path === '/') return <Home />;
  const project = projectForPath(path);
  return project ? <ProjectPage project={project} /> : <NotFound />;
}
