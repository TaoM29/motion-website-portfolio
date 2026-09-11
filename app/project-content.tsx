'use client';

import { useState } from 'react';
import { ArrowUpRight, Expand } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '../components/ui/dialog';
import type { Project, ProjectWithImage } from './portfolio';

export function ProjectSummary({ project }: { project: Project }) {
  return <>
    {(!project.summary || project.tagsLabel) && <p>{project.description}</p>}
    {project.summary && <dl className="project-summary">{project.summary.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.text}</dd></div>)}</dl>}
  </>;
}

export function ProjectSkills({ project }: { project: Project }) {
  return <>{project.tagsLabel && <p className="project-skills-label">{project.tagsLabel}</p>}<ul className="project-tags" aria-label={project.tagsLabel ?? 'Project skills'}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></>;
}

export function ProjectActions({ project }: { project: Project }) {
  return <div className="project-actions">
    {project.details && <Sheet><SheetTrigger className="project-detail-button">{project.detailLabel ?? 'View project details'}<ArrowUpRight size={17} aria-hidden="true" /></SheetTrigger>
      <SheetContent className="project-detail-panel">
        <p className="project-detail-category">{project.category} · {project.status}</p>
        <SheetTitle className="project-detail-title">{project.title}</SheetTitle>
        <SheetDescription className="project-detail-intro">{project.summary?.[0]?.text ?? project.description}</SheetDescription>
        {project.details.map(item => <section className="project-detail-section" key={item.label}><h3>{item.label}</h3><p>{item.text}</p></section>)}
        <ProjectSkills project={project} />
      </SheetContent>
    </Sheet>}
    {project.url && <a className="project-detail-button" href={project.url} target="_blank" rel="noopener noreferrer">Visit website<ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (new tab)</span></a>}
  </div>;
}

export function ProjectImage({ project }: { project: ProjectWithImage }) {
  const [arabic, setArabic] = useState(false);
  const visual = project.image;
  const selected = arabic && project.alternateImage ? project.alternateImage : visual;
  return <figure className={`stacked-visual ${visual.fit ?? 'cover'}`}>
    {project.alternateImage && <div className="project-language" role="group" aria-label={`${project.title} screenshot language`}>
      <button type="button" aria-pressed={!arabic} onClick={() => setArabic(false)}>English</button>
      <button type="button" aria-pressed={arabic} onClick={() => setArabic(true)}>{project.alternateImage.label}</button>
    </div>}
    <Dialog>
      <DialogTrigger className="stacked-image project-image-button" aria-label={`Enlarge ${project.title} image${project.alternateImage ? arabic ? ' in Arabic' : ' in English' : ''}`}>
        <img src={selected.src} alt={selected.alt} width={visual.width} height={visual.height} loading="lazy" />
        <span className="project-image-expand"><Expand size={16} aria-hidden="true" />Enlarge</span>
      </DialogTrigger>
      <DialogContent className="project-image-dialog">
        <DialogTitle>{project.title}{project.alternateImage ? arabic ? ' — Arabic' : ' — English' : ''}</DialogTitle>
        <DialogDescription>{visual.caption ?? selected.alt}</DialogDescription>
        <img src={selected.src} alt={selected.alt} width={visual.width} height={visual.height} />
      </DialogContent>
    </Dialog>
    {visual.caption && <figcaption>{visual.caption}</figcaption>}
  </figure>;
}
