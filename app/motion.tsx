'use client';

import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type PointerEvent } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { type ProjectWithImage } from './portfolio';
import { TennisDribble } from './tennis-dribble';

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
  const color = useTransform(progress, [start, end], ['#9ba0ab', '#e4e6ea']);
  return <motion.span className="scroll-word" style={{ color: enabled ? color : '#e4e6ea' }}>{children}</motion.span>;
}

export function ScrollParagraph({ text, className = '' }: { text: string; className?: string }) {
  const paragraph = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const range = useMotionValue({ start: 0, end: 0 });
  const progress = useTransform(() => {
    const { start, end } = range.get();
    const position = scrollY.get();
    return end <= start ? 1 : Math.max(0, Math.min(1, (position - start) / (end - start)));
  });

  useLayoutEffect(() => {
    const element = paragraph.current;
    if (!element) return;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      const top = bounds.top + window.scrollY;
      const height = window.innerHeight;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - height);
      // All section introductions use the same reading window. Clamp it to
      // the available page scroll so Contact can finish brightening too.
      range.set({
        start: Math.max(0, Math.min(maxScroll, top - height * 0.92)),
        end: Math.max(0, Math.min(maxScroll, top + bounds.height - height * 0.64)),
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [range, text]);

  const words = text.split(/\s+/);
  return <p ref={paragraph} className={`scroll-paragraph ${className}`}><span className="sr-only">{text}</span><span aria-hidden="true">{words.map((word, index) => <span key={`${index}-${word}`}><ScrollWord enabled={!reduced} progress={progress} start={index / words.length * 0.85} end={(index + 1) / words.length * 0.85 + 0.15}>{word}</ScrollWord>{' '}</span>)}</span></p>;
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
  { image: '/images/projects/personal-performance-overview.png', title: 'Personal Performance', detail: 'Overview design', fit: 'cover' },
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

function StackedProject({ project, index, count, top, progress, enabled }: { project: ProjectWithImage; index: number; count: number; top: number; progress: MotionValue<number>; enabled: boolean }) {
  const visual = project.image;
  const depth = (count - 1 - index) / Math.max(count - 1, 1);
  const foldStart = index / count * 0.85;
  const scale = useTransform(progress, [foldStart, 1], [1, 1 - depth * 0.1]);
  const rotateX = useTransform(progress, [foldStart, 1], [0, -depth * 4]);
  const imageY = useTransform(progress, [0, 1], [10, -10]);
  return <motion.article className="stacked-project" style={enabled ? { top, scale, rotateX, transformPerspective: 1500, zIndex: index + 1 } : { top: 0, scale: 1, rotateX: 0, zIndex: index + 1 }}>
    <div className="stacked-copy">
      <div className="project-meta"><span>{project.category}</span><span className={`status ${project.status === 'In progress' ? 'in-progress' : ''}`}><i />{project.status}</span></div>
      <h3>{project.title}</h3><p>{project.description}</p>
      <ul className="project-tags" aria-label="Project topics">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    </div>
    <figure className={`stacked-visual ${visual.fit ?? 'cover'}`}><div className="stacked-image"><motion.img src={visual.src} alt={visual.alt} width={visual.width} height={visual.height} loading="lazy" style={enabled && visual.fit !== 'artwork' ? { y: imageY } : { y: 0 }} /></div>{visual.caption && <figcaption>{visual.caption}</figcaption>}</figure>
  </motion.article>;
}

export function FeaturedProjects({ projects }: { projects: ProjectWithImage[] }) {
  const stack = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled('(min-width: 1001px) and (min-height: 800px)');
  const [cardsFit, setCardsFit] = useState(false);
  const stackStep = Math.min(26, 78 / Math.max(projects.length - 1, 1));
  const enabled = motionEnabled && cardsFit;
  const { scrollYProgress } = useScroll({ target: stack, offset: ['start start', 'end end'] });

  useEffect(() => {
    const cards = Array.from(stack.current?.children ?? []) as HTMLElement[];
    // Fold only when every card's content fits below its sticky position.
    const update = () => setCardsFit(cards.every((card, index) => card.offsetHeight + 68 + index * stackStep <= window.innerHeight - 24));
    const observer = new ResizeObserver(update);
    cards.forEach(card => observer.observe(card));
    window.addEventListener('resize', update);
    update();
    return () => { observer.disconnect(); window.removeEventListener('resize', update); };
  }, [projects, stackStep]);

  return <div ref={stack} className="project-stack" data-motion={enabled}>
    {projects.map((project, index) => <StackedProject key={project.title} project={project} index={index} count={projects.length} top={68 + index * stackStep} progress={scrollYProgress} enabled={enabled} />)}
  </div>;
}

const interestObjects = [
  { kind: 'vinyl', image: '/images/interests/vinyl-record.png', size: 1254 },
  { kind: 'strength', image: '/images/interests/dumbbell.png', size: 1254 },
  { kind: 'running', image: '/images/interests/running-shoe.png', size: 1254 },
] as const;

function InterestObject({ object, index, progress, active }: { object: typeof interestObjects[number]; index: number; progress: MotionValue<number>; active: boolean }) {
  const pointerEnabled = useMotionEnabled('(hover: hover) and (pointer: fine)');
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 130, damping: 16 });
  const y = useSpring(targetY, { stiffness: 130, damping: 16 });
  const rotateX = useTransform(y, [-12, 12], [7, -7]);
  const rotateY = useTransform(x, [-14, 14], [-9, 9]);
  const scrollY = useTransform(progress, [0, 1], index % 2 ? [-12, 16] : [20, -20]);
  const scrollRotate = useTransform(progress, [0, 1], index % 2 ? [7, -7] : [-7, 7]);
  const reset = () => { targetX.set(0); targetY.set(0); };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerEnabled || !active || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    targetX.set(((event.clientX - rect.left) / rect.width - 0.5) * 28);
    targetY.set(((event.clientY - rect.top) / rect.height - 0.5) * 24);
  };
  return <div className={`interest-object interest-${object.kind}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    <motion.div className="interest-drift" style={active ? { y: scrollY, rotate: scrollRotate } : { y: 0, rotate: 0 }}>
      <motion.div className="interest-tilt" style={active && pointerEnabled ? { x, y, rotateX, rotateY, transformPerspective: 800 } : { x: 0, y: 0, rotateX: 0, rotateY: 0 }}>
        <div className="interest-object-angle"><img className="interest-loop" src={object.image} alt="" width={object.size} height={object.size} loading="lazy" draggable={false} /></div>
      </motion.div>
    </motion.div>
    {object.kind === 'vinyl' && <div className="interest-equalizer">{[0, 1, 2, 3, 4, 5, 6].map(bar => <i key={bar} style={{ animationDelay: `${bar * -0.19}s` }} />)}</div>}
  </div>;
}

export function InterestObjects() {
  const ref = useRef<HTMLDivElement>(null);
  const tennisSlot = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount: 0.15 });
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const active = inView && pageVisible && !reduced && !paused;
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return <div className="interest-gallery" ref={ref} data-active={active}>
    <div className="interest-objects" aria-hidden="true">
      <div className="interest-object interest-tennis-slot" ref={tennisSlot} />
      {interestObjects.map((object, index) => <InterestObject key={object.kind} object={object} index={index + 1} progress={scrollYProgress} active={active} />)}
    </div>
    <TennisDribble slot={tennisSlot} gallery={ref} active={active} />
    {!reduced && <div className="interest-motion-control"><button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume interest animations' : 'Pause interest animations'}>{paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}{paused ? 'Resume motion' : 'Pause motion'}</button></div>}
  </div>;
}
