/**
 * Shows an image when a URL is set; otherwise an on-brand placeholder describing the photo needed,
 * so the client can see exactly which pictures to supply.
 */
export function Photo({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src?: string | null
  alt: string
  className?: string
  eager?: boolean
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`object-cover ${className}`}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden bg-gradient-to-br from-ink-soft via-ink to-[#2a2418] ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(45deg,#C9A24A_0_1px,transparent_1px_14px)]" />
      <div className="absolute inset-x-6 bottom-5 flex items-center gap-2 text-[0.7rem] tracking-widest text-gold/70 uppercase">
        <span className="h-px w-6 bg-gold/50" />
        Photo: {alt}
      </div>
    </div>
  )
}
