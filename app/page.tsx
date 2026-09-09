'use client';

import { motion, MotionConfig, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Mail, Plus } from 'lucide-react';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';
import { portfolio, type Project } from './portfolio';

const revealEase = [0.22, 1, 0.36, 1] as const;
const listItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase } },
};

function Reveal({ children, className = '', delay = 0, distance = 42 }: { children: ReactNode; className?: string; delay?: number; distance?: number }) {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: distance }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.9, delay, ease: revealEase }}>{children}</motion.div>;
}

function StaggerList({ children, className }: { children: ReactNode; className: string }) {
  const reducedMotion = useReducedMotion();
  return <motion.ul className={className} initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={{ visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.12 } } }}>{children}</motion.ul>;
}

function Portrait({ progress }: { progress: MotionValue<number> }) {
  const reducedMotion = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 62, damping: 12, mass: 0.85 });
  const y = useSpring(targetY, { stiffness: 62, damping: 12, mass: 0.85 });
  const rotateX = useTransform(y, [-94, 94], [10, -10]);
  const rotateY = useTransform(x, [-132, 132], [-14, 14]);
  const rotate = useTransform(x, [-132, 132], [-3, 3]);
  const scrollY = useTransform(progress, [0, 1], [0, 95]);
  const scale = useTransform(progress, [0, 1], [1, 0.93]);

  useEffect(() => {
    const reset = () => { targetX.set(0); targetY.set(0); };
    if (reducedMotion) { reset(); return; }
    let frame = 0;
    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = stage.current?.getBoundingClientRect();
        if (!bounds) return;
        const padding = 180;
        if (bounds.bottom < 0 || bounds.top > window.innerHeight || event.clientX < bounds.left - padding || event.clientX > bounds.right + padding || event.clientY < bounds.top - padding || event.clientY > bounds.bottom + padding) { reset(); return; }
        // The stationary stage keeps the enlarged magnetic area stable as the portrait moves.
        const travel = Math.min(132, Math.max(16, (window.innerWidth - bounds.width) / 2 - 12));
        targetX.set(Math.max(-travel, Math.min(travel, (event.clientX - bounds.left - bounds.width / 2) * 0.42)));
        targetY.set(Math.max(-94, Math.min(94, (event.clientY - bounds.top - bounds.height / 2) * 0.38)));
      });
    }
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) { cancelAnimationFrame(frame); reset(); } };
    const cancel = () => { cancelAnimationFrame(frame); reset(); };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', leave);
    window.addEventListener('blur', cancel);
    window.addEventListener('scroll', cancel, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('blur', cancel);
      window.removeEventListener('scroll', cancel);
    };
  }, [reducedMotion, targetX, targetY]);

  return <div className="portrait-stage" ref={stage}>
    <div className="portrait-halo" aria-hidden="true" />
    <motion.div className="portrait-scroll" style={reducedMotion ? {} : { y: scrollY, scale }}>
      <motion.div className="portrait-tilt" style={reducedMotion ? { x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0 } : { x, y, rotate, rotateX, rotateY }}>
        <div className="portrait-float"><img className="portrait" src="/images/personal-avatar-suit.png" width="1024" height="1536" alt="3D illustrated portrait of Taofik Muhriz wearing a charcoal suit, white shirt, and burgundy tie" fetchPriority="high" draggable={false} /></div>
      </motion.div>
    </motion.div>
  </div>;
}

function TypedLine({ text, delay, pace, className = '' }: { text: string; delay: number; pace: number; className?: string }) {
  return <span className={`typed-line ${className}`} aria-hidden="true" style={{ '--typing-pace': `${pace}s` } as CSSProperties}>
    {Array.from(text).map((character, index) => <span className="typed-character" key={index} style={{ '--character-delay': `${delay + index * pace}s` } as CSSProperties}>{character}</span>)}
  </span>;
}

function IntroductionTitle({ progress }: { progress: MotionValue<number> }) {
  const reducedMotion = useReducedMotion();
  const y = useTransform(progress, [0, 1], [0, -55]);
  const greeting = portfolio.name ? 'HI, I’M' : 'A LITTLE';
  const name = portfolio.name ? `${portfolio.name.split(' ')[0].toUpperCase()}.` : 'ABOUT ME.';
  return <motion.div className="hero-title" style={reducedMotion ? {} : { y }}>
    <p className="eyebrow"><span className="sr-only">Data science, AI, Software</span><TypedLine text="Data science · AI · Software" delay={0.2} pace={0.028} /></p>
    <h1 aria-label={`${greeting} ${name}`}>
      <TypedLine text={greeting} delay={1.1} pace={0.085} className="typed-greeting" />
      <br />
      <TypedLine text={name} delay={1.95} pace={0.115} className="typed-name" />
    </h1>
  </motion.div>;
}

function Hero() {
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  return <section className="hero" id="top" ref={hero}>
    <nav className="navigation" aria-label="Main navigation">
      <a className="wordmark" href="#top" aria-label="Back to home">{portfolio.name || 'PERSONAL'}<span> / PORTFOLIO</span><i aria-hidden="true" /></a>
      <div className="nav-links"><a href="#about">About</a><a href="#projects">Work</a><a href="#interests">Interests</a><a href="#contact">Contact <ArrowUpRight size={15} aria-hidden="true" /></a></div>
    </nav>
    <IntroductionTitle progress={scrollYProgress} />
    <Portrait progress={scrollYProgress} />
    <div className="hero-footer"><Reveal><p>{portfolio.introduction}</p></Reveal><a className="round-link" href="#projects">Explore my work <ArrowDown size={19} aria-hidden="true" /></a></div>
    <span className="hero-coordinate">Introduction</span>
  </section>;
}

function SectionLabel({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  return <div className="section-intro">
    <motion.span className="section-sweep" aria-hidden="true" initial={reducedMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: revealEase }} />
    <Reveal distance={18}><p className="section-label">{children}<Plus size={15} aria-hidden="true" /></p></Reveal>
  </div>;
}

function About() {
  return <section className="section about-section" id="about"><SectionLabel>The person behind the work</SectionLabel>
    <div className="about-grid"><Reveal><h2>More than<br /><span className="muted-word">a portfolio.</span></h2></Reveal><Reveal className="about-copy" delay={0.12}><p className="large-copy">{portfolio.about}</p><a className="text-link" href="#background">Get to know me <ArrowDown size={17} aria-hidden="true" /></a></Reveal></div>
    <div className="profile-details" id="background"><Reveal><h3>My background</h3><p>{portfolio.background || 'A fuller introduction to my story, experience, and the path that brought me here is on its way.'}</p></Reveal><Reveal delay={0.12}><h3>My skills</h3>{portfolio.skills.length ? <StaggerList className="skill-list">{portfolio.skills.map(skill => <motion.li variants={listItem} key={skill.name}><strong>{skill.name}</strong><span>{skill.description}</span></motion.li>)}</StaggerList> : <p>I’ll be sharing the tools, skills, and ways of thinking behind my work here.</p>}</Reveal></div>
  </section>;
}

function ProjectEntry({ project }: { project: Project }) {
  return <Reveal><article className="project-entry"><div className="project-body"><div className="project-meta"><span>{project.category}</span><span className={`status ${project.status === 'In progress' ? 'in-progress' : ''}`}><i />{project.status}</span></div><h3>{project.title}</h3><p>{project.description}</p><ul className="project-tags" aria-label="Project topics">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>{project.url && <a className="project-link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} (new tab)`}><ArrowUpRight aria-hidden="true" /></a>}</article></Reveal>;
}

function Projects() {
  const [filter, setFilter] = useState<'All work' | Project['status']>('All work');
  const visible = portfolio.projects.filter(project => filter === 'All work' || project.status === filter);
  return <section className="section projects-section" id="projects"><SectionLabel>Portfolio / Projects</SectionLabel><div className="section-heading"><Reveal><h2>Made. Making.<br /><span className="muted-word">Always evolving.</span></h2></Reveal><Reveal className="section-summary" delay={0.14}><p>A collection of finished work<br />and ideas taking shape.</p></Reveal></div>
    <Reveal distance={24}><div className="project-filters" role="group" aria-label="Filter projects">{(['All work', 'Completed', 'In progress'] as const).map(value => <button type="button" key={value} onClick={() => setFilter(value)} aria-pressed={filter === value}>{value}<span>{value === 'All work' ? portfolio.projects.length : portfolio.projects.filter(project => project.status === value).length}</span></button>)}</div></Reveal>
    <div className="project-results" aria-live="polite">{visible.length ? visible.map(project => <ProjectEntry key={project.title} project={project} />) : <div className="empty-projects"><p>More work to share soon.</p><span>Completed projects will appear here as they’re added to my portfolio.</span></div>}</div>
  </section>;
}

function InterestAccent() {
  const reducedMotion = useReducedMotion();
  return <motion.span className="interest-asterisk" aria-hidden="true" initial={reducedMotion ? false : { opacity: 0, rotate: -70, scale: 0.8 }} whileInView={{ opacity: 1, rotate: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.3, ease: revealEase }}>✳</motion.span>;
}

function Interests() {
  return <section className="section interests-section" id="interests"><SectionLabel>Outside the project</SectionLabel><Reveal><h2>What keeps<br /><span className="metallic">me curious.</span></h2></Reveal><div className="interests-content"><InterestAccent /><Reveal><p className="interests-intro">I’m a social person who values a good balance between work and life. When I step away from a project, you’ll often find me on a tennis court, lifting weights, heading out for a run, or spending time with friends.</p>{portfolio.interests.length ? <StaggerList className="interests-list">{portfolio.interests.map(interest => <motion.li variants={listItem} key={interest}>{interest}</motion.li>)}</StaggerList> : <p>There’s more to me than my work.<br /><span className="muted-word">More about my interests, inspirations, and life outside projects — coming soon.</span></p>}</Reveal></div></section>;
}

function Contact() {
  return <footer className="section contact-section" id="contact"><SectionLabel>Get in touch</SectionLabel><Reveal><h2>LET’S<br /><span className="metallic">CONNECT.</span><ArrowUpRight aria-hidden="true" /></h2></Reveal><Reveal className="contact-bottom" delay={0.1}><p>Have a project in mind, a question,<br />or something interesting to share?</p><div className="contact-links">{portfolio.contact.length ? portfolio.contact.map(link => <a className="text-link" href={link.href} key={link.label}>{link.label}{link.href.startsWith('mailto:') ? <Mail size={18} aria-hidden="true" /> : <ArrowUpRight size={18} aria-hidden="true" />}</a>) : <p className="contact-pending">Contact details coming soon.</p>}</div></Reveal><Reveal className="footer-line" distance={18}><span>© {new Date().getFullYear()} {portfolio.name || 'Personal portfolio'}</span><a href="#top">Back to top ↑</a><span>A work in progress. Just like me.</span></Reveal></footer>;
}

export default function Home() {
  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#about">Skip introduction</a><main><Hero /><About /><Projects /><Interests /></main><Contact /></MotionConfig>;
}
