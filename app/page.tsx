'use client';

import { motion, MotionConfig, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Mail, Plus } from 'lucide-react';
import { type CSSProperties, type PointerEvent, type ReactNode, useState } from 'react';
import { portfolio, type Project } from './portfolio';

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.65 }}>{children}</motion.div>;
}

function Portrait() {
  const reducedMotion = useReducedMotion();
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 95, damping: 17, mass: 0.8 });
  const y = useSpring(targetY, { stiffness: 95, damping: 17, mass: 0.8 });
  const rotateX = useTransform(y, [-56, 56], [7, -7]);
  const rotateY = useTransform(x, [-72, 72], [-9, 9]);

  function reset() {
    targetX.set(0);
    targetY.set(0);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    // Measure the stationary stage, so movement never shifts the hover target.
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const vertical = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    const horizontalTravel = Math.min(72, Math.max(12, (window.innerWidth - bounds.width) / 2 - 8));
    targetX.set(horizontal * horizontalTravel);
    targetY.set(vertical * 56);
  }
  return <div className="portrait-stage" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    <div className="portrait-halo" aria-hidden="true" />
    <motion.div className="portrait-tilt" style={reducedMotion ? { x: 0, y: 0, rotateX: 0, rotateY: 0 } : { x, y, rotateX, rotateY }}>
      <div className="portrait-float"><img className="portrait" src="/images/personal-avatar-suit.png" width="1024" height="1536" alt="3D illustrated portrait of Taofik Muhriz wearing a charcoal suit, white shirt, and burgundy tie" fetchPriority="high" draggable={false} /></div>
    </motion.div>
  </div>;
}

function TypedLine({ text, delay, pace, className = '' }: { text: string; delay: number; pace: number; className?: string }) {
  return <span className={`typed-line ${className}`} aria-hidden="true" style={{ '--typing-pace': `${pace}s` } as CSSProperties}>
    {Array.from(text).map((character, index) => <span className="typed-character" key={index} style={{ '--character-delay': `${delay + index * pace}s` } as CSSProperties}>{character}</span>)}
  </span>;
}

function IntroductionTitle() {
  const greeting = portfolio.name ? 'HI, I’M' : 'A LITTLE';
  const name = portfolio.name ? `${portfolio.name.split(' ')[0].toUpperCase()}.` : 'ABOUT ME.';
  return <div className="hero-title">
    <p className="eyebrow"><span className="sr-only">Data science, AI, Software</span><TypedLine text="Data science · AI · Software" delay={0.2} pace={0.028} /></p>
    <h1 aria-label={`${greeting} ${name}`}>
      <TypedLine text={greeting} delay={1.1} pace={0.085} className="typed-greeting" />
      <br />
      <TypedLine text={name} delay={1.95} pace={0.115} className="typed-name" />
    </h1>
  </div>;
}

function Hero() {
  return <section className="hero" id="top">
    <nav className="navigation" aria-label="Main navigation">
      <a className="wordmark" href="#top" aria-label="Back to home">{portfolio.name || 'PERSONAL'}<span> / PORTFOLIO</span><i aria-hidden="true" /></a>
      <div className="nav-links"><a href="#about">About</a><a href="#projects">Work</a><a href="#interests">Interests</a><a href="#contact">Contact <ArrowUpRight size={15} aria-hidden="true" /></a></div>
    </nav>
    <IntroductionTitle />
    <Portrait />
    <div className="hero-footer"><Reveal><p>{portfolio.introduction}</p></Reveal><a className="round-link" href="#projects">Explore my work <ArrowDown size={19} aria-hidden="true" /></a></div>
    <span className="hero-coordinate">Introduction</span>
  </section>;
}

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <p className="section-label"><span>{number}</span>{children}<Plus size={15} aria-hidden="true" /></p>;
}

function About() {
  return <section className="section about-section" id="about"><SectionLabel number="02">The person behind the work</SectionLabel>
    <div className="about-grid"><Reveal><h2>More than<br /><span className="muted-word">a portfolio.</span></h2></Reveal><Reveal className="about-copy"><p className="large-copy">{portfolio.about}</p><a className="text-link" href="#background">Get to know me <ArrowDown size={17} aria-hidden="true" /></a></Reveal></div>
    <div className="profile-details" id="background"><Reveal><h3>My background</h3><p>{portfolio.background || 'A fuller introduction to my story, experience, and the path that brought me here is on its way.'}</p></Reveal><Reveal><h3>My skills</h3>{portfolio.skills.length ? <ul className="skill-list">{portfolio.skills.map(skill => <li key={skill.name}><strong>{skill.name}</strong><span>{skill.description}</span></li>)}</ul> : <p>I’ll be sharing the tools, skills, and ways of thinking behind my work here.</p>}</Reveal></div>
  </section>;
}

function ProjectEntry({ project, index }: { project: Project; index: number }) {
  return <Reveal><article className="project-entry"><div className="project-index">{String(index + 1).padStart(2, '0')}</div><div className="project-body"><div className="project-meta"><span>{project.category}</span><span className={`status ${project.status === 'In progress' ? 'in-progress' : ''}`}><i />{project.status}</span></div><h3>{project.title}</h3><p>{project.description}</p><ul className="project-tags" aria-label="Project topics">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>{project.url && <a className="project-link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} (new tab)`}><ArrowUpRight aria-hidden="true" /></a>}</article></Reveal>;
}

function Projects() {
  const [filter, setFilter] = useState<'All work' | Project['status']>('All work');
  const visible = portfolio.projects.filter(project => filter === 'All work' || project.status === filter);
  return <section className="section projects-section" id="projects"><SectionLabel number="03">Portfolio / Projects</SectionLabel><div className="section-heading"><Reveal><h2>Made. Making.<br /><span className="muted-word">Always evolving.</span></h2></Reveal><p>A collection of finished work<br />and ideas taking shape.</p></div>
    <div className="project-filters" role="group" aria-label="Filter projects">{(['All work', 'Completed', 'In progress'] as const).map(value => <button type="button" key={value} onClick={() => setFilter(value)} aria-pressed={filter === value}>{value}<span>{value === 'All work' ? portfolio.projects.length : portfolio.projects.filter(project => project.status === value).length}</span></button>)}</div>
    <div className="project-results" aria-live="polite">{visible.length ? visible.map((project, index) => <ProjectEntry key={project.title} project={project} index={index} />) : <div className="empty-projects"><p>More work to share soon.</p><span>Completed projects will appear here as they’re added to my portfolio.</span></div>}</div>
  </section>;
}

function Interests() {
  return <section className="section interests-section" id="interests"><SectionLabel number="04">Outside the project</SectionLabel><Reveal><h2>What keeps<br /><span className="metallic">me curious.</span></h2></Reveal><div className="interests-content"><span className="interest-asterisk" aria-hidden="true">✳</span><Reveal><p className="interests-intro">I’m a social person who values a good balance between work and life. When I step away from a project, you’ll often find me on a tennis court, lifting weights, heading out for a run, or spending time with friends.</p>{portfolio.interests.length ? <ul className="interests-list">{portfolio.interests.map(interest => <li key={interest}>{interest}</li>)}</ul> : <p>There’s more to me than my work.<br /><span className="muted-word">More about my interests, inspirations, and life outside projects — coming soon.</span></p>}</Reveal></div></section>;
}

function Contact() {
  return <footer className="section contact-section" id="contact"><SectionLabel number="05">Get in touch</SectionLabel><Reveal><h2>LET’S<br /><span className="metallic">CONNECT.</span><ArrowUpRight aria-hidden="true" /></h2></Reveal><div className="contact-bottom"><p>Have a project in mind, a question,<br />or something interesting to share?</p><div className="contact-links">{portfolio.contact.length ? portfolio.contact.map(link => <a className="text-link" href={link.href} key={link.label}>{link.label}{link.href.startsWith('mailto:') ? <Mail size={18} aria-hidden="true" /> : <ArrowUpRight size={18} aria-hidden="true" />}</a>) : <p className="contact-pending">Contact details coming soon.</p>}</div></div><div className="footer-line"><span>© {new Date().getFullYear()} {portfolio.name || 'Personal portfolio'}</span><a href="#top">Back to top ↑</a><span>A work in progress. Just like me.</span></div></footer>;
}

export default function Home() {
  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#about">Skip introduction</a><main><Hero /><About /><Projects /><Interests /></main><Contact /></MotionConfig>;
}
