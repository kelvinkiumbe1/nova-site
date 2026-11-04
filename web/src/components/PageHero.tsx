export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(45deg,#C9A24A_0_1px,transparent_1px_18px)]" />
      <div className="container-page relative py-20 sm:py-28">
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">{title}</h1>
        <div className="mt-6 h-px w-20 bg-gold" />
        {intro && <p className="mt-6 max-w-2xl text-lg text-white/70">{intro}</p>}
      </div>
    </section>
  )
}
