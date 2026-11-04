import type { SiteSettings } from '../lib/types'
import { IconFacebook, IconInstagram, IconLinkedIn, IconTikTok } from './Icons'

export function SocialLinks({ settings, className = '' }: { settings: SiteSettings; className?: string }) {
  const links = [
    { href: settings.facebookUrl, label: 'Facebook', Icon: IconFacebook },
    { href: settings.instagramUrl, label: 'Instagram', Icon: IconInstagram },
    { href: settings.linkedinUrl, label: 'LinkedIn', Icon: IconLinkedIn },
    { href: settings.tiktokUrl, label: 'TikTok', Icon: IconTikTok },
  ].filter((l) => l.href)
  if (links.length === 0) return null
  return (
    <div className={`flex gap-3 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:border-gold hover:text-gold"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  )
}
