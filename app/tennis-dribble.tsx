'use client';

// These local fallback assets are served directly by Vite, without a Next image server.
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type RefObject } from 'react';
import { useInView } from 'framer-motion';
import type { TennisLayout, TennisScene } from './tennis-scene';

export function TennisDribble({ slot, gallery, active }: {
  slot: RefObject<HTMLDivElement | null>;
  gallery: RefObject<HTMLDivElement | null>;
  active: boolean;
}) {
  const court = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const scene = useRef<TennisScene | null>(null);
  const activeRef = useRef(active);
  const nearViewport = useInView(court, { margin: '300px', once: true });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    activeRef.current = active;
    scene.current?.setActive(active);
  }, [active]);

  useEffect(() => {
    const anchor = slot.current;
    const container = gallery.current;
    const layer = court.current;
    const host = canvasHost.current;
    if (!anchor || !container || !layer || !host) return;
    let cancelled = false;
    let instance: TennisScene | null = null;
    let layout: TennisLayout;
    const measure = () => {
      const bounds = container.getBoundingClientRect();
      const cell = anchor.getBoundingClientRect();
      layout = { width: bounds.width, height: bounds.height, left: cell.left - bounds.left, top: cell.top - bounds.top, slotWidth: cell.width };
      layer.style.setProperty('--racket-left', `${layout.left}px`);
      layer.style.setProperty('--racket-top', `${layout.top}px`);
      layer.style.setProperty('--racket-width', `${layout.slotWidth}px`);
      layer.style.setProperty('--ball-left', `${layout.left + layout.slotWidth * 0.25 - 15}px`);
      instance?.resize(layout);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(anchor);
    observer.observe(container);
    window.addEventListener('resize', measure);
    measure();
    if (nearViewport) {
      // Load the 3D renderer only as this section approaches the viewport.
      import('./tennis-scene').then(({ createTennisScene }) => {
        if (cancelled) return;
        instance = createTennisScene(host, () => setReady(false));
        scene.current = instance;
        instance.resize(layout);
        instance.setActive(activeRef.current);
        setReady(true);
      }).catch(() => {
        // Keep a static illustration if the browser cannot create a WebGL context.
        instance?.dispose();
        scene.current = null;
        if (!cancelled) setReady(false);
      });
    }
    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('resize', measure);
      instance?.dispose();
      scene.current = null;
    };
  }, [slot, gallery, nearViewport]);

  return <div className="tennis-court" ref={court} aria-hidden="true" data-rendered={ready}>
    <div className="tennis-fallback">
      <img className="tennis-fallback-racket" src="/images/interests/tennis-racket.png" alt="" width={1536} height={1024} loading="lazy" draggable={false} />
      <div className="tennis-fallback-ball"><img src="/images/tennis-accent.png" alt="" width={1254} height={1254} loading="lazy" draggable={false} /></div>
    </div>
    <div className="tennis-canvas" ref={canvasHost} />
  </div>;
}
