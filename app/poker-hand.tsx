import { useId } from 'react';

/** Separate card layers let the hand open without moving the chip stack. */
export function PokerHand() {
  const id = useId().replace(/:/g, '');
  const paper = `${id}-paper`;
  const red = `${id}-red`;
  const charcoal = `${id}-charcoal`;
  return <svg className="poker-hand" viewBox="0 0 320 320" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={paper} x1="60" y1="55" x2="220" y2="250" gradientUnits="userSpaceOnUse">
        <stop stopColor="#faf8f1" /><stop offset=".5" stopColor="#dddcd8" /><stop offset="1" stopColor="#96999f" />
      </linearGradient>
      <linearGradient id={red} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#e35569" /><stop offset=".48" stopColor="#8f1e32" /><stop offset="1" stopColor="#42121f" />
      </linearGradient>
      <linearGradient id={charcoal} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#70737a" /><stop offset=".5" stopColor="#303239" /><stop offset="1" stopColor="#14151a" />
      </linearGradient>
    </defs>
    <ellipse cx="168" cy="275" rx="115" ry="13" fill="#000" opacity=".35" />
    {(['♠', '♥'] as const).map((suit, index) => <g key={suit} className={`poker-card poker-card-${index ? 'front' : 'back'}`}>
      <rect x="94" y="47" width="123" height="184" rx="10" fill="#000" opacity=".3" transform="translate(3 7)" />
      <rect x="94" y="47" width="123" height="184" rx="10" fill={`url(#${paper})`} stroke="#fff" strokeOpacity=".5" />
      <rect x="101" y="54" width="109" height="170" rx="6" stroke="#666972" strokeOpacity=".25" />
      <g fill={index ? '#ad263f' : '#20232a'} fontFamily="Georgia, serif" textAnchor="middle">
        <text x="111" y="79" fontSize="25">A</text>
        <text x="111" y="100" fontSize="22">{suit}</text>
        <text x="155.5" y="167" fontSize="77">{suit}</text>
        <g transform="rotate(180 155.5 139)">
          <text x="111" y="79" fontSize="25">A</text>
          <text x="111" y="100" fontSize="22">{suit}</text>
        </g>
      </g>
    </g>)}
    {[0, 1, 2, 3].map(chip => <g key={chip} transform={`translate(219 ${260 - chip * 9})`}>
      <ellipse cy="5" rx="43" ry="17" fill={`url(#${chip % 2 ? red : charcoal})`} stroke="#111217" />
      <path d="M-35 3v6M-19 11v7M3 14v7M25 9v7M39 1v7" stroke="#e0d9ce" strokeWidth="5" opacity=".65" />
      <ellipse rx="43" ry="16" fill={`url(#${chip % 2 ? red : charcoal})`} stroke="#a6a0a1" strokeOpacity=".5" />
      <ellipse rx="35" ry="12" stroke="#eadfda" strokeWidth="5" strokeDasharray="9 13" />
      <ellipse rx="26" ry="9" stroke="#e6c9ca" strokeOpacity=".6" />
    </g>)}
    <g className="poker-chip" transform="translate(113 262) rotate(-17)">
      <ellipse cy="5" rx="39" ry="16" fill={`url(#${red})`} stroke="#471525" />
      <ellipse rx="39" ry="16" fill={`url(#${red})`} stroke="#f1959f" strokeOpacity=".6" />
      <ellipse rx="32" ry="12" stroke="#eadfda" strokeWidth="5" strokeDasharray="9 12" />
      <ellipse rx="23" ry="8" stroke="#edb0b9" strokeOpacity=".7" />
    </g>
  </svg>;
}
