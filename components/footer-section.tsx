import { cn } from "@/lib/utils";
import Link from "next/link";

const footerSections = [
  {
    title: "Features",
    links: ["Latency", "Privacy", "Multimodal", "Adaptive learning"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Brand"],
  },
  {
    title: "Resources",
    links: ["Docs", "Privacy", "Terms", "Status"],
  },
  {
    title: "Connect",
    links: ["Discord", "X (Twitter)", "Hugging Face", "YouTube"],
  },
];

export default function Footer() {
  return (
    <footer
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
          "[mask-image:linear-gradient(to_bottom,black_60%,transparent)]",
          "bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        )}
      />

      {/* ── Right patterned strip ── */}
      <div
        aria-hidden
        className={cn(
          "col-start-4 row-span-full border-x",
          "[mask-image:linear-gradient(to_bottom,black_60%,transparent)]",
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

        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">

          {/* ── Left: Brand ── */}
          <div className="flex flex-col justify-between border-b border-border px-6 py-12 lg:border-b-0 lg:border-r lg:py-16">
            <div>
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-4">
                Est. 2024
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                BotBuddy
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Your intelligent AI companion for modern workflows.
              </p>
            </div>

            {/* Bottom copyright */}
            <p className="mt-12 font-mono text-[10px] tracking-widest text-muted-foreground/50 uppercase">
              © {new Date().getFullYear()} BotBuddy. All rights reserved.
            </p>
          </div>

          {/* ── Right: Nav links ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 px-6 py-12 lg:py-16">
            {footerSections.map((section, i) => (
              <div
                key={section.title}
                className={cn(
                  "flex flex-col gap-4 pb-8 lg:pb-0",
                  // vertical dividers between columns on md+
                  i !== 0 && "md:border-l md:border-border md:pl-6",
                  i !== 0 && "md:ml-6",
                )}
              >
                {/* Section heading */}
                <p className="font-mono text-[10px] font-medium tracking-widest text-foreground uppercase">
                  {section.title}
                </p>

                {/* Links */}
                <div className="flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
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
    </footer>
  );
}