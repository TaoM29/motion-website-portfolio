'use client';

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { portfolio, type Project } from './portfolio';

const ease = [0.22, 1, 0.36, 1] as const;

function useMotionEnabled(query = '(min-width: 761px)') {
  const reduced = useReducedMotion();
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches && !reduced;
}

export function MagneticLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const enabled = useMotionEnabled('(hover: hover) and (pointer: fine)');
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 190, damping: 20 });
  const y = useSpring(targetY, { stiffness: 190, damping: 20 });
  const reset = () => { targetX.set(0); targetY.set(0); };
  const move = (event: PointerEvent<HTMLSpanElement>) => {
    if (!enabled || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    targetX.set(Math.max(-9, Math.min(9, (event.clientX - rect.left - rect.width / 2) * 0.13)));
    targetY.set(Math.max(-7, Math.min(7, (event.clientY - rect.top - rect.height / 2) * 0.18)));
  };
  return <span className="magnetic-zone" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset} onBlur={reset}>
    <motion.a href={href} className={className} style={enabled ? { x, y } : { x: 0, y: 0 }} onFocus={reset}>{children}</motion.a>
  </span>;
}

function ScrollWord({ children, progress, start, end, enabled }: { children: string; progress: MotionValue<number>; start: number; end: number; enabled: boolean }) {
  const color = useTransform(progress, [start, end], ['#858b97', '#e4e6ea']);
  return <motion.span className="scroll-word" style={{ color: enabled ? color : '#e4e6ea' }}>{children}</motion.span>;
}

export function ScrollParagraph({ text }: { text: string }) {
  const paragraph = useRef<HTMLParagraphElement>(null);
  const enabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({ target: paragraph, offset: ['start 0.9', 'end 0.6'] });
  const words = text.split(' ');
  return <p ref={paragraph} className="large-copy scroll-paragraph"><span className="sr-only">{text}</span><span aria-hidden="true">{words.map((word, index) => <span key={`${index}-${word}`}><ScrollWord enabled={enabled} progress={scrollYProgress} start={index / words.length * 0.85} end={(index + 1) / words.length * 0.85 + 0.15}>{word}</ScrollWord>{' '}</span>)}</span></p>;
}

export function OrbitAccent() {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-35, 75]);
  const y = useTransform(scrollYProgress, [0, 1], [30, -45]);
  return <motion.div ref={ref} className="orbit-accent" aria-hidden="true" style={enabled ? { rotate, y } : { rotate: 0, y: 0 }}><i /><i /><i /><b /></motion.div>;
}

export function SkillItem({ name, description, index }: { name: string; description: string; index: number }) {
  const enabled = useMotionEnabled('(hover: hover) and (pointer: fine)');
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 160, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 160, damping: 20 });
  const reset = () => { rx.set(0); ry.set(0); };
  const move = (event: PointerEvent<HTMLLIElement>) => {
    if (!enabled || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    rx.set(-(event.clientY - rect.top - rect.height / 2) / rect.height * 5);
    ry.set((event.clientX - rect.left - rect.width / 2) / rect.width * 5);
  };
  return <motion.li className="skill-depth" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset} style={enabled ? { rotateX, rotateY, transformPerspective: 900 } : { rotateX: 0, rotateY: 0 }}
    initial={reduced ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, delay: reduced ? 0 : index % 2 * 0.08, ease }}>
    <strong>{name}</strong><span>{description}</span>
  </motion.li>;
}

const visuals = [
  { image: '/images/projects/energy-weather-dashboard.png', title: 'Energy & Weather', detail: 'Interactive dashboard', fit: 'cover' },
  { image: '/images/projects/altawfiq-en.png', title: 'AL-TAWFIQ', detail: 'English website', fit: 'cover' },
  { image: '/images/projects/lung-ct-illustration.png', title: 'Lung CT research', detail: 'AI-generated illustration', fit: 'artwork' },
  { image: '/images/projects/morris-marine.png', title: 'Morris Marine', detail: 'Website in development', fit: 'cover' },
  { image: '/images/projects/altawfiq-ar.png', title: 'AL-TAWFIQ', detail: 'Arabic website', fit: 'cover' },
] as const;

export function ProjectRibbon() {
  const section = useRef<HTMLElement>(null);
  const enabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] });
  const right = useTransform(scrollYProgress, [0, 1], [-360, -40]);
  const left = useTransform(scrollYProgress, [0, 1], [-40, -360]);
  return <section className="project-ribbon" ref={section} aria-label="A glimpse of my work" data-motion={enabled}>
    {[visuals, [...visuals].reverse()].map((row, rowIndex) => <div className="ribbon-window" key={rowIndex}>
      <motion.div className="ribbon-track" style={{ x: enabled ? rowIndex === 0 ? right : left : 0 }}>
        {[0, 1, 2].flatMap(repeat => row.map((visual, index) => <a className={`ribbon-tile${repeat ? ' ribbon-repeat' : ''}`} href="#projects" key={`${repeat}-${index}`} aria-hidden={repeat ? true : undefined} tabIndex={repeat ? -1 : 0}>
          <div className={`ribbon-image ${visual.fit}`}><img src={visual.image} alt="" loading="lazy" width={1440} height={960} /></div>
          <span><strong>{visual.title}</strong><small>{visual.detail}</small></span><ArrowUpRight size={17} aria-hidden="true" />
        </a>))}
      </motion.div>
    </div>)}
  </section>;
}

const featureDefinitions = [
  { title: 'Predicting mucus plugs from lung CT scans', image: '/images/projects/lung-ct-illustration.png', alt: 'AI-generated illustration inspired by lung CT imaging, with layered scans and subtle crimson highlights', caption: 'AI-generated illustration · Lung CT research', fit: 'artwork' },
  { title: 'AL-TAWFIQ Trading Group', image: '/images/projects/altawfiq-en.png', alt: 'English homepage of the AL-TAWFIQ website I developed', caption: 'English and Arabic web development', fit: 'cover' },
  { title: 'Morris Marine', image: '/images/projects/morris-marine.png', alt: 'Current homepage of the Morris Marine website I am developing', caption: 'A client website in development', fit: 'cover' },
] as const;
export const featuredTitles = featureDefinitions.map(feature => feature.title);

function StackedProject({ project, index, progress, enabled }: { project: Project; index: number; progress: MotionValue<number>; enabled: boolean }) {
  const visual = featureDefinitions[index];
  const targetScale = 1 - (featureDefinitions.length - 1 - index) * 0.045;
  const scale = useTransform(progress, [index * 0.28, 1], [1, targetScale]);
  const rotateX = useTransform(progress, [index * 0.28, 1], [0, -(featureDefinitions.length - 1 - index) * 2]);
  const imageY = useTransform(progress, [0, 1], [10, -10]);
  return <motion.article className="stacked-project" style={enabled ? { top: 68 + index * 26, scale, rotateX, transformPerspective: 1500, zIndex: index + 1 } : { top: 0, scale: 1, rotateX: 0, zIndex: index + 1 }}>
    <div className="stacked-copy">
      <div className="project-meta"><span>{project.category}</span><span className={`status ${project.status === 'In progress' ? 'in-progress' : ''}`}><i />{project.status}</span></div>
      <h3>{project.title}</h3><p>{project.description}</p>
      <ul className="project-tags" aria-label="Project topics">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    </div>
    <figure className={`stacked-visual ${visual.fit}`}><div className="stacked-image"><motion.img src={visual.image} alt={visual.alt} loading="lazy" style={enabled && visual.fit === 'cover' ? { y: imageY } : { y: 0 }} /></div><figcaption>{visual.caption}</figcaption></figure>
  </motion.article>;
}

export function FeaturedProjects() {
  const stack = useRef<HTMLDivElement>(null);
  const enabled = useMotionEnabled('(min-width: 1001px) and (min-height: 800px)');
  const { scrollYProgress } = useScroll({ target: stack, offset: ['start start', 'end end'] });
  return <div ref={stack} className="project-stack" data-motion={enabled}>
    {featureDefinitions.map((feature, index) => <StackedProject key={feature.title} project={portfolio.projects.find(project => project.title === feature.title)!} index={index} progress={scrollYProgress} enabled={enabled} />)}
  </div>;
}

export function TennisAccent() {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-24, 36]);
  const y = useTransform(scrollYProgress, [0, 1], [36, -48]);
  return <div className="tennis-accent" ref={ref} aria-hidden="true"><motion.img src="/images/tennis-accent.png" alt="" width={1254} height={1254} loading="lazy" style={enabled ? { y, rotate } : { y: 0, rotate: 0 }} /></div>;
}
