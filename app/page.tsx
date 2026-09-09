'use client';

import { motion, MotionConfig, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Mail, Phone } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
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
    <div className="portrait-halo" aria-hidden="true" />
    <motion.div className="portrait-scroll" style={reducedMotion ? {} : { y: scrollY, scale }}>
      <motion.div className="portrait-tilt" style={reducedMotion ? { x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0 } : { x, y, rotate, rotateX, rotateY }}>
        <div className="portrait-float"><img className="portrait" src="/images/personal-avatar-suit.png" width="1024" height="1536" alt="3D illustrated portrait of Taofik Muhriz wearing a charcoal suit, white shirt, and burgundy tie" fetchPriority="high" draggable={false} /></div>
      </motion.div>
    </motion.div>
  </div>;
}

function TypedLine({ text, delay, pace, className = '' }: { text: string; delay: number; pace: number; className?: string }) {
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const characters = Array.from(text);

  useEffect(() => {
    if (reducedMotion) return;
    let timeout = 0;
    let current = 0;
    setCount(0);
    setStarted(false);
    const tick = () => {
      setStarted(true);
      current += 1;
      setCount(current);
      if (current < text.length) timeout = window.setTimeout(tick, pace * 1000);
    };
    timeout = window.setTimeout(tick, delay * 1000);
    return () => window.clearTimeout(timeout);
  }, [text, delay, pace, reducedMotion]);

  const visibleCount = reducedMotion ? characters.length : count;
  const complete = visibleCount >= characters.length;
  return <span className={`typed-line ${className}`} aria-hidden="true" data-complete={complete}>
    <span className="typed-placeholder">{text}</span>
    <span className="typed-output">{characters.slice(0, visibleCount).join('')}{started && !reducedMotion && <span className={`typing-cursor${complete ? ' is-finished' : ''}`} />}</span>
  </span>;
}

function IntroductionTitle() {
  const firstName = portfolio.name.split(' ')[0];
  return <div className="hero-title">
    <p className="eyebrow"><span className="sr-only">Data science, AI, Software</span><TypedLine text="Data science · AI · Software" delay={0.15} pace={0.025} /></p>
    <h1 aria-label={`Hi, I’m ${firstName}.`}>
      <TypedLine text="Hi, I’m" delay={0.9} pace={0.085} className="typed-greeting" />
      <TypedLine text={`${firstName}.`} delay={1.65} pace={0.115} className="typed-name" />
    </h1>
  </div>;
}

function Hero() {
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  return <section className="hero" id="top" ref={hero}>
    <nav className="navigation" aria-label="Main navigation">
      <a className="wordmark" href="#top" aria-label="Back to home">{portfolio.name}</a>
      <div className="nav-links"><a href="#about">About</a><a href="#projects">Projects</a><a href="#interests">Interests</a><a href="#contact">Contact</a></div>
    </nav>
    <div className="hero-content">
      <div className="hero-copy">
        <IntroductionTitle />
        <Reveal className="hero-summary" delay={0.2} distance={16}>
          <p>{portfolio.introduction}</p>
          <a className="round-link" href="#projects">See my projects <ArrowDown size={18} aria-hidden="true" /></a>
        </Reveal>
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
    <div className="about-grid"><Reveal><h2>A little<br /><span className="muted-word">about me.</span></h2></Reveal><Reveal className="about-copy" delay={0.12}><p className="large-copy">{portfolio.about}</p><a className="text-link" href="#background">Get to know me <ArrowDown size={17} aria-hidden="true" /></a></Reveal></div>
    <div className="profile-details" id="background"><Reveal><h3>My background</h3><p>{portfolio.background}</p></Reveal><Reveal delay={0.12}><h3>My skills</h3>{portfolio.skills.length ? <StaggerList className="skill-list">{portfolio.skills.map(skill => <motion.li variants={listItem} key={skill.name}><strong>{skill.name}</strong><span>{skill.description}</span></motion.li>)}</StaggerList> : <p>I’ll be sharing the tools, skills, and ways of thinking behind my work here.</p>}</Reveal></div>
  </section>;
}

function ProjectEntry({ project }: { project: Project }) {
  return <Reveal><article className="project-entry"><div className="project-body"><div className="project-meta"><span>{project.category}</span><span className={`status ${project.status === 'In progress' ? 'in-progress' : ''}`}><i />{project.status}</span></div><h3>{project.title}</h3><p>{project.description}</p><ul className="project-tags" aria-label="Project topics">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>{project.url && <a className="project-link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} (new tab)`}><ArrowUpRight aria-hidden="true" /></a>}</article></Reveal>;
}

function Projects() {
  const [filter, setFilter] = useState<'All work' | Project['status']>('All work');
  const visible = portfolio.projects.filter(project => filter === 'All work' || project.status === filter);
  return <section className="section projects-section" id="projects"><SectionLabel>Projects</SectionLabel><div className="section-heading"><Reveal><h2>What I’ve<br /><span className="muted-word">been working on.</span></h2></Reveal><Reveal className="section-summary" delay={0.14}><p>Research from my studies, projects for clients,<br />and a few things I’m building for myself.</p></Reveal></div>
    <Reveal distance={24}><div className="project-filters" role="group" aria-label="Filter projects">{(['All work', 'Completed', 'In progress'] as const).map(value => <button type="button" key={value} onClick={() => setFilter(value)} aria-pressed={filter === value}>{value}<span>{value === 'All work' ? portfolio.projects.length : portfolio.projects.filter(project => project.status === value).length}</span></button>)}</div></Reveal>
    <div className="project-results" aria-live="polite">{visible.length ? visible.map(project => <ProjectEntry key={project.title} project={project} />) : <div className="empty-projects"><p>More work to share soon.</p><span>Completed projects will appear here as they’re added to my portfolio.</span></div>}</div>
  </section>;
}

function Interests() {
  return <section className="section interests-section" id="interests">
    <SectionLabel>Outside work</SectionLabel>
    <div className="interests-content">
      <Reveal><h2>Away from<br /><span className="muted-word">my desk.</span></h2></Reveal>
      <div>
        <Reveal delay={0.1}><p className="interests-intro">I like being around people, and making time for friends matters to me. I want work to fit alongside the rest of my life.</p><p className="interests-intro">Tennis, strength training, and running are a big part of how I spend my free time.</p></Reveal>
        <StaggerList className="interests-list">{portfolio.interests.map(interest => <motion.li variants={listItem} key={interest}>{interest}</motion.li>)}</StaggerList>
      </div>
    </div>
  </section>;
}

function Contact() {
  return <footer className="section contact-section" id="contact"><SectionLabel>Contact</SectionLabel><Reveal><h2>Say hello.</h2></Reveal><Reveal className="contact-bottom" delay={0.1}><p>If you’d like to talk about a role, a project,<br />or something I’ve worked on, get in touch.</p><div className="contact-links">{portfolio.contact.length ? portfolio.contact.map(link => <a className="text-link" href={link.href} key={link.label}>{link.label}{link.href.startsWith('mailto:') ? <Mail size={18} aria-hidden="true" /> : link.href.startsWith('tel:') ? <Phone size={18} aria-hidden="true" /> : <ArrowUpRight size={18} aria-hidden="true" />}</a>) : <p className="contact-pending">Contact details coming soon.</p>}</div></Reveal><Reveal className="footer-line" distance={18}><span>© {new Date().getFullYear()} {portfolio.name || 'Personal portfolio'}</span><a href="#top">Back to top ↑</a></Reveal></footer>;
}

export default function Home() {
  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#about">Skip introduction</a><main><Hero /><About /><Projects /><Interests /></main><Contact /></MotionConfig>;
}
