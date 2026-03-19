import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  label: string;
  className?: string;
}

export function SectionBadge({ label, className }: SectionBadgeProps) {
  return (
    <div className={cn("flex items-center justify-center gap-0", className)}>
      {/* Left dashed line fading out */}
      <div
        aria-hidden
        className="h-px w-10 border-t border-dashed [mask-image:linear-gradient(to_right,transparent,black)] sm:w-20"
      />

      {/* Badge */}
      <div className="flex items-center gap-1.5 border border-border bg-card px-3 py-1 font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
        <span className="size-1.5 rounded-full bg-foreground/30" aria-hidden />
        {label}
      </div>

      {/* Right dashed line fading out */}
      <div
        aria-hidden
        className="h-px w-10 border-t border-dashed [mask-image:linear-gradient(to_left,transparent,black)] sm:w-20"
      />
    </div>
  );
}