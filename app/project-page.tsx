// Static Vite pages use ordinary links and pre-optimized images, not Next APIs.
/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { portfolio, type Project } from './portfolio';
import { projectPath } from './site';
import { ProjectSkills } from './project-content';

export function ProjectPage({ project }: { project: Project }) {
  const related = portfolio.projects.filter(item => item.slug !== project.slug).slice(0, 3);
  return <>
    <a className="skip-link" href="#case-study">Skip to case study</a>
    <nav className="navigation" aria-label="Main navigation"><a className="wordmark" href="/">{portfolio.name}</a><a href="/#projects"><ArrowLeft size={16} aria-hidden="true" /> All projects</a></nav>
    <main id="case-study" className="case-study">
      <nav className="case-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>{project.title}</span></nav>
      <header><p className="eyebrow">{project.category} · {project.status}</p><h1>{project.title}</h1><p className="case-lead">{project.description}</p><ProjectSkills project={project} /></header>
      {project.image && <figure className="case-image"><img src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} fetchPriority="high" />{project.image.caption && <figcaption>{project.image.caption}</figcaption>}</figure>}
      <div className="case-details">{project.details?.map(item => <section key={item.label}><h2>{item.label}</h2><p>{item.text}</p></section>)}</div>
      {project.alternateImage && <figure className="case-image"><img src={project.alternateImage.src} alt={project.alternateImage.alt} width={project.image?.width} height={project.image?.height} loading="lazy" /><figcaption>{project.alternateImage.label} website</figcaption></figure>}
      <div className="case-actions">{project.url && <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (new tab)</span></a>}<a className="text-link" href="/#contact">Discuss a project <ArrowUpRight size={18} aria-hidden="true" /></a></div>
      <aside className="case-related" aria-label="More projects"><h2>More of my work</h2><ul>{related.map(item => <li key={item.slug}><a className="text-link" href={projectPath(item)}>{item.title}<ArrowUpRight size={18} aria-hidden="true" /></a></li>)}</ul></aside>
    </main>
    <footer className="case-footer"><span>{portfolio.name} · Data Science &amp; Software</span><a href="/">Back to portfolio ↑</a></footer>
  </>;
}

export function NotFound() {
  return <main className="case-study"><p className="eyebrow">404</p><h1>Page not found.</h1><p className="case-lead">This page doesn’t exist. Explore my projects from the portfolio.</p><a className="text-link" href="/">Back to portfolio <ArrowLeft size={18} aria-hidden="true" /></a></main>;
}
