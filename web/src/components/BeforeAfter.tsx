import { useState } from 'react'

import { Photo } from './Photo'

/** Drag/keyboard-accessible before/after comparison slider. */
export function BeforeAfter({ before, after, title }: { before: string | null; after: string | null; title: string }) {
  const [pos, setPos] = useState(50)
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden select-none">
      <Photo src={after} alt={`${title}: after cleaning`} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Photo src={before} alt={`${title}: before cleaning`} className="absolute inset-0 h-full w-full grayscale" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold text-xs font-bold text-ink">⇆</span>
      </div>
      <span className="absolute top-4 left-4 bg-ink/80 px-3 py-1 text-xs tracking-widest text-white uppercase">Before</span>
      <span className="absolute top-4 right-4 bg-gold px-3 py-1 text-xs tracking-widest text-ink uppercase">After</span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  )
}
