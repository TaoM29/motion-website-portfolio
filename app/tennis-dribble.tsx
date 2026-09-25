'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
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
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');

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
    import('./tennis-scene').then(async ({ createTennisScene }) => {
      if (cancelled) return;
      instance = createTennisScene(host, () => { if (!cancelled) setStatus('fallback'); });
      scene.current = instance;
      instance.resize(layout);
      await instance.prepare();
      if (cancelled) return;
      instance.setActive(activeRef.current);
      setStatus(current => current === 'fallback' ? current : 'ready');
    }).catch(() => {
      instance?.dispose();
      if (scene.current === instance) scene.current = null;
      if (!cancelled) setStatus('fallback');
    });
    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('resize', measure);
      instance?.dispose();
      scene.current = null;
    };
  }, [slot, gallery]);

  return <div className="tennis-court" ref={court} aria-hidden="true" data-status={status}>
    {status === 'fallback' && <div className="tennis-fallback">
      <img className="tennis-fallback-racket" src="/images/interests/tennis-racket.png" alt="" width={1536} height={1024} loading="lazy" draggable={false} />
      <div className="tennis-fallback-ball"><img src="/images/tennis-accent.png" alt="" width={1254} height={1254} loading="lazy" draggable={false} /></div>
    </div>}
    <div className="tennis-canvas" ref={canvasHost} />
  </div>;
}
