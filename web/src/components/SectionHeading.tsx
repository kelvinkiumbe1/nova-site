export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  light = false,
}: {
  eyebrow?: string
  title: string
  intro?: string
  center?: boolean
  light?: boolean
}) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`mt-3 text-3xl leading-tight sm:text-4xl ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
      <div className={`mt-5 h-px w-16 bg-gold ${center ? 'mx-auto' : ''}`} />
      {intro && <p className={`mt-5 text-base leading-relaxed ${light ? 'text-white/70' : 'text-stone'}`}>{intro}</p>}
    </div>
  )
}
