import { portfolio, type Project } from './portfolio';

export const site = {
  origin: 'https://builtbytaofik.com',
  name: 'Taofik Muhriz',
  title: 'Taofik Muhriz — Data Science & Software',
  description: 'Taofik Muhriz, data scientist and software developer in Fredrikstad, Norway. Explore machine learning research, data tools and web development projects.',
};

export const projectPath = (project: Project) => `/projects/${project.slug}`;
export const projectForPath = (path: string) => portfolio.projects.find(project => projectPath(project) === path.replace(/\/$/, ''));

export function pageMetadata(path: string) {
  const project = projectForPath(path);
  const missing = path !== '/' && !project;
  const url = `${site.origin}${project ? projectPath(project) : '/'}`;
  const title = missing ? `Page not found — ${site.name}` : project ? `${project.title} — ${site.name}` : site.title;
  const description = project ? project.description.split(/(?<=\.)\s/)[0] : site.description;
  const person = {
    '@type': 'Person', '@id': `${site.origin}/#person`, name: portfolio.name,
    url: `${site.origin}/`, description: portfolio.introduction,
    image: `${site.origin}/images/personal-avatar-head.webp`,
    sameAs: portfolio.contact.filter(link => link.href.startsWith('https://')).map(link => link.href),
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Norwegian University of Life Sciences (NMBU)' },
    knowsAbout: portfolio.skills.map(skill => skill.name),
  };
  const website = { '@type': 'WebSite', '@id': `${site.origin}/#website`, url: `${site.origin}/`, name: site.name, alternateName: 'Built by Taofik', inLanguage: 'en', author: { '@id': person['@id'] } };
  const page = {
    '@type': project ? 'WebPage' : 'ProfilePage', '@id': `${url}#webpage`, url, name: title,
    description, inLanguage: 'en', isPartOf: { '@id': website['@id'] },
    mainEntity: { '@id': project ? `${url}#project` : person['@id'] },
    ...(project ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  };
  const graph: object[] = [website, person, page];
  if (project) {
    graph.push({ '@type': 'CreativeWork', '@id': `${url}#project`, url, name: project.title, description: project.description, creator: { '@id': person['@id'] }, keywords: project.tags, ...(project.image ? { image: `${site.origin}${project.image.src}` } : {}) });
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
      { '@type': 'ListItem', position: 2, name: project.title, item: url },
    ] });
  }
  return { title, description, url, missing, image: `${site.origin}/images/social-card.jpg`, structuredData: { '@context': 'https://schema.org', '@graph': graph } };
}
