import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/ui/section-badge";

const companies = [
  { src: "https://storage.efferd.com/logo/nvidia-wordmark.svg", alt: "Nvidia" },
  { src: "https://storage.efferd.com/logo/supabase-wordmark.svg", alt: "Supabase" },
  { src: "https://storage.efferd.com/logo/openai-wordmark.svg", alt: "OpenAI" },
  { src: "https://storage.efferd.com/logo/vercel-wordmark.svg", alt: "Vercel" },
  { src: "https://storage.efferd.com/logo/github-wordmark.svg", alt: "GitHub" },
];

export default function TrustedBySection() {
  return (
    <section
      className={cn(
        "relative w-full",
        // Always show the intersection-2 grid — just narrower strips on mobile
        "grid grid-cols-[1fr_0.5rem_minmax(0,64rem)_0.5rem_1fr] sm:grid-cols-[1fr_1rem_minmax(0,64rem)_1rem_1fr]",
        "[--pattern-fg:color-mix(in_oklab,var(--color-gray-950),transparent_95%)]",
        "dark:[--pattern-fg:color-mix(in_oklab,var(--color-white),transparent_90%)]",
      )}
    >
      {/* ── Left patterned vertical strip ── */}
      <div
        aria-hidden
        className={cn(
          "col-start-2 row-span-full border-x",
          "[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]",
          "bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        )}
      />

      {/* ── Right patterned vertical strip ── */}
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

        {/* Header: badge + heading */}
        <div className="flex flex-col items-center gap-6 px-4 py-10 text-center sm:px-6 md:py-20">
          <SectionBadge label="Trusted By" />
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="text-muted-foreground">BotBuddy is trusted by </span>
            <span className="text-foreground">104+ Businesses.</span>
          </h2>
        </div>

        {/* Dashed divider above logos */}
        <div
          aria-hidden
          className={cn(
            "w-full border-t border-dashed",
            "[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]",
          )}
        />

        {/* Logo grid — 2 cols mobile, 3 sm, 5 md+ */}
        <div className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {companies.map((company, i) => (
            <div
              key={company.alt}
              className={cn(
                "group flex items-center justify-center px-4 py-8 sm:px-6",
                "transition-colors duration-200 hover:bg-muted/40",
                "border-b border-border/60",
                // Mobile: left border on every odd item
                i % 2 !== 0 && "border-l border-border/60",
                // sm (3 cols): override — left border on non-multiples of 3
                i % 3 !== 0 ? "sm:border-l sm:border-border/60" : "sm:border-l-0",
                // md (5 cols): override — left border on non-multiples of 5
                i % 5 !== 0 ? "md:border-l md:border-border/60" : "md:border-l-0",
              )}
            >
              <img
                src={company.src}
                alt={company.alt}
                className={cn(
                  "pointer-events-none block h-4 w-auto max-w-[80px] select-none",
                  "opacity-50 transition-opacity duration-300 group-hover:opacity-100",
                  "sm:h-5 sm:max-w-[110px]",
                  "dark:brightness-0 dark:invert",
                )}
                loading="lazy"
                width="auto"
                height="auto"
              />
            </div>
          ))}
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
  );
}