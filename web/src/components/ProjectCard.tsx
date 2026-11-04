import type { Project } from '../lib/types'
import { Photo } from './Photo'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden bg-white ring-1 ring-ink/8">
      <div className="overflow-hidden">
        <Photo
          src={project.coverImageUrl ?? project.afterImageUrl}
          alt={project.title}
          className="aspect-[4/3] w-full transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        {project.location && <p className="eyebrow">{project.location}</p>}
        <h3 className="mt-2 text-xl">{project.title}</h3>
        {project.description && <p className="mt-3 line-clamp-3 text-sm text-stone">{project.description}</p>}
      </div>
    </article>
  )
}
