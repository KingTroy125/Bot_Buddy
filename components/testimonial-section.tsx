"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { SectionBadge } from "@/components/ui/section-badge"

const testimonials = [
  {
    id: 1,
    quote: "BotBuddy saved us hundreds of hours in customer support.",
    author: "Sarah Chen",
    role: "Support Lead at Figma",
    avatar: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=1480&auto=format&fit=crop",
  },
  {
    id: 2,
    quote: "The fastest way to get answers from my own codebase. Truly brilliant.",
    author: "Marcus Johnson",
    role: "Engineer at Vercel",
    avatar: "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=1287&auto=format&fit=crop",
  },
  {
    id: 3,
    quote: "BotBuddy feels like having an extra team member working 24/7.",
    author: "Elena Rodriguez",
    role: "Founder at Craft",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=2670&auto=format&fit=crop",
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayedQuote, setDisplayedQuote] = useState(testimonials[0].quote)
  const [displayedRole, setDisplayedRole] = useState(testimonials[0].role)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setDisplayedQuote(testimonials[index].quote)
      setDisplayedRole(testimonials[index].role)
      setActiveIndex(index)
      setTimeout(() => setIsAnimating(false), 400)
    }, 200)
  }

  return (
    <section
      className={cn(
        "relative w-full",
        "grid grid-cols-[1fr_0.5rem_minmax(0,64rem)_0.5rem_1fr]",
        "sm:grid-cols-[1fr_1rem_minmax(0,64rem)_1rem_1fr]",
        "[--pattern-fg:color-mix(in_oklab,var(--color-gray-950),transparent_95%)]",
        "dark:[--pattern-fg:color-mix(in_oklab,var(--color-white),transparent_90%)]",
      )}
    >
      {/* ── Left patterned strip ── */}
      <div
        aria-hidden
        className={cn(
          "col-start-2 row-span-full border-x",
          "[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]",
          "bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        )}
      />

      {/* ── Right patterned strip ── */}
      <div
        aria-hidden
        className={cn(
          "col-start-4 row-span-full border-x",
          "[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]",
          "bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        )}
      />

      {/* ── Content column ── */}
      <div className="col-start-3 flex flex-col">

        {/* Top dashed divider */}
        <div
          aria-hidden
          className={cn(
            "w-full border-t border-dashed",
            "[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
          )}
        />

        <div className="flex flex-col items-center gap-10 px-4 py-16 text-center sm:px-6 md:py-24">

          {/* Section badge */}
          <SectionBadge label="Testimonials" />

          {/* Quote */}
          <div className="relative px-8 max-w-2xl w-full">
            {/* Decorative quote marks */}
            <span className="absolute -left-2 -top-6 font-mono text-6xl text-foreground/[0.06] select-none pointer-events-none leading-none">
              "
            </span>

            <p
              className={cn(
                "text-2xl font-medium tracking-tight text-foreground leading-relaxed md:text-3xl",
                "transition-all duration-300 ease-out",
                isAnimating ? "opacity-0 translate-y-1 blur-sm" : "opacity-100 translate-y-0 blur-0",
              )}
            >
              {displayedQuote}
            </p>

            <span className="absolute -right-2 -bottom-8 font-mono text-6xl text-foreground/[0.06] select-none pointer-events-none leading-none">
              "
            </span>
          </div>

          {/* Role */}
          <p
            className={cn(
              "font-mono text-[10px] tracking-widest text-muted-foreground uppercase",
              "transition-all duration-500 ease-out",
              isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
            )}
          >
            {displayedRole}
          </p>

          {/* Author selector — flat bordered cells, no rounded pills */}
          <div className="flex items-center border border-border">
            {testimonials.map((testimonial, index) => {
              const isActive = activeIndex === index
              const isHovered = hoveredIndex === index && !isActive
              const showName = isActive || isHovered

              return (
                <button
                  key={testimonial.id}
                  onClick={() => handleSelect(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    "relative flex items-center gap-0 cursor-pointer",
                    "transition-all duration-300 ease-out",
                    "border-r border-border last:border-r-0",
                    isActive
                      ? "bg-foreground"
                      : "bg-transparent hover:bg-muted/50",
                    showName ? "pr-4 pl-2 py-2" : "p-2",
                  )}
                >
                  {/* Avatar */}
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className={cn(
                      "size-7 object-cover flex-shrink-0",
                      "transition-all duration-300",
                      isActive ? "ring-1 ring-background/30" : "",
                    )}
                  />

                  {/* Expanding name */}
                  <div
                    className={cn(
                      "grid transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      showName ? "grid-cols-[1fr] opacity-100 ml-2" : "grid-cols-[0fr] opacity-0 ml-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <span
                        className={cn(
                          "font-mono text-[10px] font-medium tracking-widest uppercase whitespace-nowrap block",
                          isActive ? "text-background" : "text-foreground",
                        )}
                      >
                        {testimonial.author}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

        </div>

        {/* Bottom dashed divider */}
        <div
          aria-hidden
          className={cn(
            "w-full border-b border-dashed",
            "[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
          )}
        />

      </div>
    </section>
  )
}