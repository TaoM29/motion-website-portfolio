'use client';

import { useEffect, useRef, useState } from 'react';
import type { AnimationItem } from 'lottie-web';

export function PokerHand({ active }: { active: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<AnimationItem | null>(null);
  const activeRef = useRef(active);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    activeRef.current = active;
    if (active) player.current?.play();
    else player.current?.pause();
  }, [active]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let cancelled = false;
    let animation: AnimationItem | undefined;
    const controller = new AbortController();
    Promise.all([
      import('lottie-web/build/player/lottie_light'),
      fetch('/images/interests/poker-chip-shuffle.json', { signal: controller.signal }).then(response => {
        if (!response.ok) throw new Error('Poker animation unavailable');
        return response.json();
      }),
    ]).then(([{ default: lottie }, animationData]) => {
      if (cancelled) return;
      animation = lottie.loadAnimation({
        container, renderer: 'svg', loop: true, autoplay: false,
        animationData, rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      });
      player.current = animation;
      animation.addEventListener('DOMLoaded', () => {
        if (cancelled || !animation) return;
        setReady(true);
        if (activeRef.current) animation.play();
      });
      animation.addEventListener('data_failed', () => {
        if (!cancelled) setReady(false);
      });
    }).catch(() => undefined);
    return () => {
      cancelled = true;
      controller.abort();
      animation?.destroy();
      player.current = null;
    };
  }, []);

  return <div className="poker-hand" data-ready={ready} aria-hidden="true">
    <svg className="poker-fallback" viewBox="0 0 320 320" fill="none">
      {[103, 217].map(x => <g key={x}>
        {[0, 1, 2, 3, 4, 5].map(chip => <g key={chip} transform={`translate(${x} ${253 - chip * 15})`}>
          <path d="M-55 0v13a55 18 0 0 0 110 0V0" fill="#851e34" stroke="#59121d" />
          <path d="M-43 10v13M-7 17v14M33 14v13" stroke="#bcc0c9" strokeWidth="12" />
          <ellipse rx="55" ry="18" fill="#de354b" stroke="#ef6578" />
          <ellipse rx="46" ry="14" stroke="#e4e6ea" strokeWidth="6" strokeDasharray="16 18" />
          <ellipse rx="32" ry="10" fill="#e4e6ea" />
        </g>)}
      </g>)}
    </svg>
    <div className="poker-player" ref={host} />
  </div>;
}
