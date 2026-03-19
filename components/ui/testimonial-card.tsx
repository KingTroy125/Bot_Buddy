import { cn } from "@/lib/utils"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ author, text, href, className }: TestimonialCardProps) {
  const content = (
    <div
      className={cn(
        "relative flex min-h-[240px] w-[350px] flex-col justify-between gap-4 rounded-xl sm:rounded-2xl md:rounded-3xl",
        "border border-border bg-card p-5 sm:p-6 md:p-7",
        "transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:border-primary/20",
        className,
      )}
    >
      {/* Quote Icon */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-gradient-to-b from-primary to-primary/20 border border-border shadow-[inset_0px_4px_8px_1px_rgba(244,244,254,0.25)]">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Testimonial Text */}
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed flex-grow">"{text}"</p>

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <img
          src={author.avatar || "/placeholder.svg"}
          alt={author.name}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
        />
        <div>
          <p className="text-foreground text-sm md:text-base font-medium leading-tight">{author.name}</p>
          <p className="text-muted-foreground text-xs md:text-sm">{author.handle}</p>
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }

  return content
}
