'use client';

import { motion, MotionConfig, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Mail, Phone } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ProjectSummary, ProjectSkills, ProjectActions } from './project-content';
import { portfolio, hasProjectImage, type Project } from './portfolio';
import { FeaturedProjects, MagneticLink, OrbitAccent, ProjectRibbon, ScrollParagraph, SkillItem, InterestObjects } from './motion';

const revealEase = [0.22, 1, 0.36, 1] as const;
function Reveal({ children, className = '', delay = 0, distance = 42 }: { children: ReactNode; className?: string; delay?: number; distance?: number }) {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={reducedMotion ? false : { y: distance }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.9, delay, ease: revealEase }}>{children}</motion.div>;
}

function Portrait({ progress }: { progress: MotionValue<number> }) {
  const reducedMotion = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 72, damping: 15, mass: 0.9 });
  const y = useSpring(targetY, { stiffness: 72, damping: 15, mass: 0.9 });
  const rotateX = useTransform(y, [-94, 94], [9, -9]);
  const rotateY = useTransform(x, [-112, 112], [-12, 12]);
  const rotate = useTransform(x, [-112, 112], [-5, 5]);
  const scrollY = useTransform(progress, [0, 1], [0, 45]);
  const scale = useTransform(progress, [0, 1], [1, 0.97]);

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
        const leftTravel = Math.min(112, Math.max(0, bounds.left - 16));
        const rightTravel = Math.min(112, Math.max(0, window.innerWidth - bounds.right - 16));
        targetX.set(Math.max(-leftTravel, Math.min(rightTravel, (event.clientX - bounds.left - bounds.width / 2) * 0.42)));
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
    <motion.div className="portrait-scroll" style={reducedMotion ? {} : { y: scrollY, scale }}>
      <motion.div className="portrait-tilt" style={reducedMotion ? { x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0 } : { x, y, rotate, rotateX, rotateY }}>
        <div className="portrait-float"><img className="portrait" src="/images/personal-avatar-head.webp" srcSet="/images/personal-avatar-head-small.webp 480w, /images/personal-avatar-head.webp 960w" sizes="(max-width: 760px) 88vw, 44vw" width="1254" height="1254" alt="Floating 3D illustrated head of Taofik Muhriz" fetchPriority="high" draggable={false} /></div>
      </motion.div>
    </motion.div>
  </div>;
}

function TypedLine({ text, delay, pace, className = '', enabled = true, onSettled }: { text: string; delay: number; pace: number; className?: string; enabled?: boolean; onSettled?: () => void }) {
  const reducedMotion = useReducedMotion();
  // Static HTML and the first hydration render contain the complete greeting.
  const [count, setCount] = useState(() => Array.from(text).length);
  const [started, setStarted] = useState(false);
  const characters = Array.from(text);

  useEffect(() => {
    if (reducedMotion || !enabled) return;
    let timeout = 0;
    let current = 0;
    setCount(0);
    setStarted(false);
    const tick = () => {
      setStarted(true);
      current += 1;
      setCount(current);
      if (current < Array.from(text).length) timeout = window.setTimeout(tick, pace * 1000);
    };
    timeout = window.setTimeout(tick, delay * 1000);
    return () => window.clearTimeout(timeout);
  }, [text, delay, pace, reducedMotion, enabled]);

  const visibleCount = reducedMotion ? characters.length : count;
  const complete = visibleCount >= characters.length;
  return <span className={`typed-line ${className}`} aria-hidden="true" data-complete={complete}>
    <span className="typed-placeholder">{text}</span>
    <span className="typed-output">{characters.slice(0, visibleCount).join('')}{started && !reducedMotion && <span className={`typing-cursor${complete ? ' is-finished' : ''}`} onAnimationEnd={event => { if (event.animationName === 'cursor-fade') onSettled?.(); }} />}</span>
  </span>;
}

function IntroductionTitle() {
  const firstName = portfolio.name.split(' ')[0];
  return <div className="hero-title">
    <p className="eyebrow"><span className="sr-only">Data science, AI, Software</span><TypedLine text="Data science · AI · Software" delay={0.15} pace={0.025} /></p>
    <h1 aria-label={`${portfolio.name} — Data Science & Software`}>
      <span className="sr-only">{portfolio.name} — Data Science &amp; Software</span>
      <TypedLine text="Hi, I’m" delay={0.9} pace={0.085} className="typed-greeting" />
      <TypedLine text={`${firstName}.`} delay={1.65} pace={0.115} className="typed-name" />
    </h1>
  </div>;
}

function IntroductionSummary() {
  return <div className="hero-summary">
    <p>{portfolio.introduction}</p>
    <div className="hero-action"><MagneticLink className="round-link" href="#projects">See my projects <ArrowDown size={18} aria-hidden="true" /></MagneticLink></div>
  </div>;
}

function Hero() {
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  return <section className="hero" id="top" ref={hero}>
    <nav className="navigation" aria-label="Main navigation">
      <a className="wordmark" href="#top" aria-label="Back to home">{portfolio.name}</a>
      <div className="nav-links"><a href="#projects">Projects</a><a href="#about">About</a><a href="#interests">Interests</a><a href="#contact">Contact</a></div>
    </nav>
    <div className="hero-content">
      <div className="hero-copy">
        <IntroductionTitle />
        <IntroductionSummary />
      </div>
      <Portrait progress={scrollYProgress} />
    </div>
    <span className="hero-coordinate">Introduction</span>
  </section>;
}

function SectionLabel({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  return <div className="section-intro">
    <motion.span className="section-sweep" aria-hidden="true" initial={reducedMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: revealEase }} />
    <Reveal distance={18}><p className="section-label">{children}</p></Reveal>
  </div>;
}

function About() {
  return <section className="section about-section" id="about"><SectionLabel>About me</SectionLabel>
    <div className="about-grid"><Reveal className="about-heading"><h2>A little<br /><span className="muted-word">about me.</span></h2><OrbitAccent /></Reveal><div className="about-copy"><ScrollParagraph className="large-copy" text={portfolio.about} /><ScrollParagraph className="about-work" text={portfolio.aboutWork} /><MagneticLink className="text-link" href="#background">Get to know me <ArrowDown size={17} aria-hidden="true" /></MagneticLink></div></div>
    <div className="profile-details" id="background"><Reveal><h3>My background</h3><p>{portfolio.background}</p></Reveal><div className="skills-section"><h3>My skills</h3><ul className="skill-list">{portfolio.skills.map((skill, index) => <SkillItem key={skill.name} name={skill.name} description={skill.description} index={index} />)}</ul></div></div>
  </section>;
}

function ProjectEntry({ project }: { project: Project }) {
  return <Reveal><article className={`project-entry${project.status === 'In progress' ? ' project-entry-in-progress' : ''}`}><div className="project-body"><div className="project-meta"><span>{project.category}</span><span className={`status ${project.status === 'In progress' ? 'in-progress' : ''}`}><i />{project.status}</span></div><h3>{project.title}</h3><ProjectSummary project={project} /><ProjectSkills project={project} /><ProjectActions project={project} /></div></article></Reveal>;
}

function Projects() {
  const [mode, setMode] = useState<'Stack' | 'List'>('Stack');
  const [filter, setFilter] = useState<'All work' | Project['status']>('All work');
  const visible = portfolio.projects.filter(project => filter === 'All work' || project.status === filter);
  const illustrated = visible.filter(hasProjectImage);
  const withoutImages = visible.filter(project => !project.image);
  return <section className="section projects-section" id="projects"><SectionLabel>Projects</SectionLabel><div className="section-heading"><Reveal><h2>What I’ve<br /><span className="muted-word">been working on.</span></h2></Reveal><ScrollParagraph className="section-summary" text="Research from my studies, projects for clients, and a few things I’m building for myself." /></div>
    <Reveal distance={24}><div className="project-toolbar"><div className="project-filters" role="group" aria-label="Filter projects">{(['All work', 'Completed', 'In progress'] as const).map(value => <button type="button" key={value} onClick={() => setFilter(value)} aria-pressed={filter === value}>{value}<span>{value === 'All work' ? portfolio.projects.length : portfolio.projects.filter(project => project.status === value).length}</span></button>)}</div><div className="project-view-toggle" role="group" aria-label="Project layout">{(['Stack', 'List'] as const).map(value => <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{value}</button>)}</div></div></Reveal>
    <div className="project-results" aria-live="polite">{illustrated.length > 0 && <FeaturedProjects key={filter} projects={illustrated} mode={mode} />}{withoutImages.map(project => <ProjectEntry key={project.title} project={project} />)}{visible.length === 0 && <div className="empty-projects"><p>More work to share soon.</p><span>Completed projects will appear here as they’re added to my portfolio.</span></div>}</div>
  </section>;
}

function Interests() {
  return <section className="section interests-section" id="interests">
    <SectionLabel>Outside work</SectionLabel>
    <div className="interests-content">
      <Reveal><h2>Away from<br /><span className="muted-word">my desk.</span></h2></Reveal>
      <div>
        {portfolio.outsideWork.map(paragraph => <ScrollParagraph className="interests-intro" key={paragraph} text={paragraph} />)}
      </div>
    </div>
    <InterestObjects />
  </section>;
}

function Contact() {
  return <footer className="section contact-section" id="contact"><SectionLabel>Contact</SectionLabel><Reveal><h2>Say hello.</h2></Reveal><div className="contact-bottom"><ScrollParagraph text="I’m interested in data science and software roles, and collaborations involving machine learning, data tools or web applications. I can contribute to data preparation, model evaluation, backend integrations and interface development." /><Reveal className="contact-links" delay={0.1}>{portfolio.contact.length ? portfolio.contact.map(link => <MagneticLink className="text-link" href={link.href} key={link.label}>{link.label}{link.href.startsWith('mailto:') ? <Mail size={18} aria-hidden="true" /> : link.href.startsWith('tel:') ? <Phone size={18} aria-hidden="true" /> : <ArrowUpRight size={18} aria-hidden="true" />}</MagneticLink>) : <p className="contact-pending">Contact details coming soon.</p>}</Reveal></div><Reveal className="footer-line" distance={18}><span>© {new Date().getFullYear()} {portfolio.name || 'Personal portfolio'}</span><a href="#top">Back to top ↑</a></Reveal></footer>;
}

export default function Home() {
  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#projects">Skip introduction</a><main><Hero /><ProjectRibbon /><Projects /><About /><Interests /></main><Contact /></MotionConfig>;
}
