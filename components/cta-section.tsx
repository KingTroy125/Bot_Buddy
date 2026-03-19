import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SectionBadge } from "@/components/ui/section-badge";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function CallToAction() {
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

        {/* CTA panel */}
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-6 px-6 py-16 text-center md:py-24",
            "dark:bg-[radial-gradient(35%_80%_at_50%_0%,theme(colors.foreground/0.06),transparent)]",
          )}
        >
          {/* Badge */}
          <SectionBadge label="Get Started" />

          {/* Heading */}
          <h2 className="max-w-xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Start Chatting for Free Today!
          </h2>

          {/* Description */}
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Jump right in and see what BotBuddy can do for you. No credit card, no account required to get started.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              className="gap-2 font-medium uppercase tracking-widest text-xs px-6"
            >
              Contact Sales
            </Button>
            <Link href="/chat">
              <Button
                className="gap-2 font-medium uppercase tracking-widest text-xs px-6"
              >
                Get Started
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </Link>
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
  );
}