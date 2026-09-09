'use client';

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ExternalLink, Mail } from 'lucide-react';
import {
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const marqueeImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

const aboutDecor = [
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    alt: '',
    className:
      'top-[4%] left-[1%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]',
    delay: 0.1,
    x: -80,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    alt: '',
    className:
      'bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]',
    delay: 0.25,
    x: -80,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    alt: '',
    className:
      'top-[4%] right-[1%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]',
    delay: 0.15,
    x: 80,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    alt: '',
    className:
      'bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]',
    delay: 0.3,
    x: 80,
  },
];

const services = [
  {
    number: '01',
    name: '3D Modeling',
    description:
      'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    number: '02',
    name: 'Rendering',
    description:
      'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    number: '03',
    name: 'Motion Design',
    description:
      'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    number: '04',
    name: 'Branding',
    description:
      'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
  },
  {
    number: '05',
    name: 'Web Design',
    description:
      'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

const projects = [
  {
    number: '01',
    category: 'Client',
    name: 'Nextlevel Studio',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    ],
  },
  {
    number: '02',
    category: 'Personal',
    name: 'Aura Brand Identity',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    ],
  },
  {
    number: '03',
    category: 'Client',
    name: 'Solaris Digital',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    ],
  },
];

const aboutText =
  "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";

type FadeInProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  id?: string;
  style?: CSSProperties;
  x?: number;
  y?: number;
};

function FadeIn({
  as = 'div',
  children,
  className,
  delay = 0,
  duration = 0.7,
  id,
  style,
  x = 0,
  y = 30,
}: FadeInProps) {
  const MotionComponent = motion.create(as);

  return (
    <MotionComponent
      className={className}
      id={id}
      initial={{ opacity: 0, x, y }}
      style={style}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
    >
      {children}
    </MotionComponent>
  );
}

type MagnetProps = {
  activeTransition?: string;
  children: ReactNode;
  className?: string;
  inactiveTransition?: string;
  padding?: number;
  strength?: number;
};

function Magnet({
  activeTransition = 'transform 0.3s ease-out',
  children,
  className,
  inactiveTransition = 'transform 0.6s ease-in-out',
  padding = 150,
  strength = 3,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('translate3d(0px, 0px, 0px)');
  const [transition, setTransition] = useState(inactiveTransition);

  function reset() {
    setTransform('translate3d(0px, 0px, 0px)');
    setTransition(inactiveTransition);
  }

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const element = ref.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const isWithinRange =
      event.clientX >= rect.left - padding &&
      event.clientX <= rect.right + padding &&
      event.clientY >= rect.top - padding &&
      event.clientY <= rect.bottom + padding;

    if (!isWithinRange) {
      reset();
      return;
    }

    const x = (event.clientX - (rect.left + rect.width / 2)) / strength;
    const y = (event.clientY - (rect.top + rect.height / 2)) / strength;

    setTransition(activeTransition);
    setTransform(`translate3d(${x}px, ${y}px, 0px)`);
  }

  return (
    <div
      className={className}
      onMouseLeave={reset}
      onMouseMove={handleMouseMove}
      ref={ref}
      style={{ transform, transition, willChange: 'transform' }}
    >
      {children}
    </div>
  );
}

function ContactButton({ className = '' }: { className?: string }) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(123deg,#18011F_7%,#B600A8_37%,#7621B0_72%,#BE4C00_100%)] px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white outline-2 outline-offset-[-3px] outline-white shadow-[0px_4px_4px_rgba(181,1,167,0.25),4px_4px_12px_#7721B1_inset] transition duration-200 hover:scale-[1.02] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
      href="#contact"
    >
      <Mail aria-hidden="true" className="h-4 w-4" />
      Contact Me
    </a>
  );
}

function LiveProjectButton() {
  return (
    <a
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-[#D7E2EA] px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[#D7E2EA] transition duration-200 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base"
      href="#contact"
    >
      Live Project
      <ExternalLink aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}

function HeroSection() {
  return (
    <section className="relative flex h-screen min-h-[620px] flex-col overflow-x-clip bg-[#0C0C0C]">
      <FadeIn
        as="nav"
        className="relative z-30 flex justify-between px-6 pt-6 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:px-10 md:pt-8 md:text-lg lg:text-[1.4rem]"
        y={-20}
      >
        {[
          ['About', '#about'],
          ['Price', '#price'],
          ['Projects', '#projects'],
          ['Contact', '#contact'],
        ].map(([label, href]) => (
          <a
            className="transition duration-200 hover:opacity-70"
            href={href}
            key={label}
          >
            {label}
          </a>
        ))}
      </FadeIn>

      <div className="relative z-20 mt-6 w-full overflow-hidden sm:mt-4 md:-mt-5">
        <FadeIn
          as="h1"
          className="hero-heading w-full whitespace-nowrap text-center text-[14vw] font-black uppercase leading-none tracking-tight sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
          delay={0.15}
          y={40}
        >
          Hi, i&apos;m jack
        </FadeIn>
      </div>

      <FadeIn
        className="absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]"
        delay={0.6}
        y={30}
      >
        <Magnet
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
          padding={150}
          strength={3}
        >
          <img
            alt="Jack, 3D creator"
            className="w-full select-none object-contain"
            draggable={false}
            src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
          />
        </Magnet>
      </FadeIn>

      <div className="relative z-30 mt-auto flex items-end justify-between gap-6 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn
          as="p"
          className="max-w-[160px] text-[clamp(0.75rem,1.4vw,1.5rem)] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
          delay={0.35}
          y={20}
        >
          a 3d creator driven by crafting striking and unforgettable projects
        </FadeIn>

        <FadeIn delay={0.5} id="contact" y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const rowOne = marqueeImages.slice(0, 11);
  const rowTwo = marqueeImages.slice(11);

  useEffect(() => {
    let frame = 0;

    function updateOffset() {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const sectionTop = section.offsetTop;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    }

    function handleScroll() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateOffset);
    }

    updateOffset();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      className="overflow-hidden bg-[#0C0C0C] pt-24 pb-10 sm:pt-32 md:pt-40"
      ref={sectionRef}
    >
      <div className="flex flex-col gap-3">
        <MarqueeRow
          images={rowOne}
          translate={offset - 200}
          label="Jack portfolio reel row one"
        />
        <MarqueeRow
          images={rowTwo}
          translate={-(offset - 200)}
          label="Jack portfolio reel row two"
        />
      </div>
    </section>
  );
}

function MarqueeRow({
  images,
  label,
  translate,
}: {
  images: string[];
  label: string;
  translate: number;
}) {
  const repeated = [...images, ...images, ...images];

  return (
    <div
      aria-label={label}
      className="flex gap-3"
      style={{
        transform: `translate3d(${translate}px, 0, 0)`,
        willChange: 'transform',
      }}
    >
      {repeated.map((src, index) => (
        <img
          alt=""
          className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
          key={`${src}-${index}`}
          loading="lazy"
          src={src}
        />
      ))}
    </div>
  );
}

function AboutSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0C0C0C] px-5 py-20 sm:px-8 md:px-10"
      id="about"
    >
      {aboutDecor.map((item) => (
        <FadeIn
          className={`pointer-events-none absolute ${item.className}`}
          delay={item.delay}
          duration={0.9}
          key={item.src}
          x={item.x}
          y={0}
        >
          <img alt={item.alt} className="w-full object-contain" src={item.src} />
        </FadeIn>
      ))}

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-10 text-center sm:gap-14 md:gap-16">
        <FadeIn
          as="h2"
          className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight"
          y={40}
        >
          About me
        </FadeIn>

        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText text={aboutText} />
          <ContactButton />
        </div>
      </div>
    </section>
  );
}

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ['start 0.8', 'end 0.2'],
    target: ref,
  });
  const words = useMemo(() => text.split(' '), [text]);
  const totalCharacters = text.replace(/\s/g, '').length;
  let characterIndex = 0;

  return (
    <p
      aria-label={text}
      className="max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]"
      ref={ref}
    >
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span className="inline-block" key={`${word}-${wordIndex}`}>
            {word.split('').map((character) => {
              const index = characterIndex;
              characterIndex += 1;

              return (
                <AnimatedCharacter
                  character={character}
                  index={index}
                  key={`${character}-${index}`}
                  progress={scrollYProgress}
                  total={totalCharacters}
                />
              );
            })}
            {wordIndex < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </p>
  );
}

function AnimatedCharacter({
  character,
  index,
  progress,
  total,
}: {
  character: string;
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const start = index / total;
  const end = Math.min((index + 1) / total, 1);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0">{character}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {character}
      </motion.span>
    </span>
  );
}

function ServicesSection() {
  return (
    <section
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
      id="price"
    >
      <FadeIn
        as="h2"
        className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28"
      >
        Services
      </FadeIn>

      <div className="mx-auto max-w-5xl border-y border-[rgba(12,12,12,0.15)]">
        {services.map((service, index) => (
          <FadeIn
            className="grid grid-cols-[minmax(90px,0.32fr)_1fr] items-center gap-6 border-b border-[rgba(12,12,12,0.15)] py-8 last:border-b-0 sm:gap-10 sm:py-10 md:grid-cols-[minmax(180px,0.38fr)_1fr] md:py-12"
            delay={index * 0.1}
            key={service.number}
          >
            <span className="text-[clamp(3rem,10vw,140px)] font-black leading-none tracking-tight text-[#0C0C0C]">
              {service.number}
            </span>
            <div>
              <h3 className="text-[clamp(1rem,2.2vw,2.1rem)] font-medium uppercase text-[#0C0C0C]">
                {service.name}
              </h3>
              <p className="mt-3 max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] font-light leading-relaxed text-[#0C0C0C]/60">
                {service.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section
      className="relative z-10 -mt-10 overflow-clip rounded-t-[40px] bg-[#0C0C0C] px-5 pt-20 pb-24 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32 md:pb-32"
      id="projects"
    >
      <FadeIn
        as="h2"
        className="hero-heading mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
      >
        Project
      </FadeIn>

      <div className="mx-auto max-w-7xl">
        {projects.map((project, index) => (
          <ProjectCard
            index={index}
            key={project.number}
            project={project}
            totalCards={projects.length}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  index,
  project,
  totalCards,
}: {
  index: number;
  project: (typeof projects)[number];
  totalCards: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ['start end', 'start start'],
    target: containerRef,
  });
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div className="h-[85vh] min-h-[700px]" ref={containerRef}>
      <motion.article
        className="sticky top-24 overflow-hidden rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 text-[#D7E2EA] sm:rounded-[50px] sm:p-6 md:top-32 md:rounded-[60px] md:p-8"
        style={{ scale, top: `calc(6rem + ${index * 28}px)` }}
      >
        <div className="grid gap-5 pb-6 md:grid-cols-[0.45fr_0.75fr_1fr_auto] md:items-end md:gap-8 md:pb-8">
          <span className="text-[clamp(3rem,10vw,140px)] font-black leading-none tracking-tight">
            {project.number}
          </span>
          <p className="text-sm font-medium uppercase tracking-[0.18em] opacity-75 sm:text-base">
            {project.category}
          </p>
          <h3 className="text-[clamp(1.8rem,4vw,4.5rem)] font-black uppercase leading-none tracking-tight">
            {project.name}
          </h3>
          <LiveProjectButton />
        </div>

        <div className="grid gap-3 md:grid-cols-[0.4fr_0.6fr]">
          <div className="grid gap-3">
            <img
              alt={`${project.name} visual 1`}
              className="h-[clamp(130px,16vw,230px)] w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
              loading="lazy"
              src={project.images[0]}
            />
            <img
              alt={`${project.name} visual 2`}
              className="h-[clamp(160px,22vw,340px)] w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
              loading="lazy"
              src={project.images[1]}
            />
          </div>
          <img
            alt={`${project.name} visual 3`}
            className="h-[clamp(310px,39vw,582px)] w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
            loading="lazy"
            src={project.images[2]}
          />
        </div>
      </motion.article>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#0C0C0C] font-sans">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </main>
  );
}
