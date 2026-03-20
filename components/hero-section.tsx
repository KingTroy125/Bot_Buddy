'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, PhoneCallIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export default function Hero() {
  const headingWords = 'Meet BotBuddy. Your Ultimate AI Companion.'.split(' ');

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        'grid grid-cols-[1fr_1rem_minmax(0,64rem)_1rem_1fr]',
        '[--pattern-fg:color-mix(in_oklab,var(--color-gray-950),transparent_95%)]',
        'dark:[--pattern-fg:color-mix(in_oklab,var(--color-white),transparent_90%)]',
      )}
    >
      {/* Left patterned strip */}
      <div
        aria-hidden
        className={cn(
          'col-start-2 row-span-full border-x',
          '[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]',
          'bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]',
          'bg-[size:10px_10px] bg-fixed',
        )}
      />

      {/* Right patterned strip */}
      <div
        aria-hidden
        className={cn(
          'col-start-4 row-span-full border-x',
          '[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]',
          'bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]',
          'bg-[size:10px_10px] bg-fixed',
        )}
      />

      {/* Content column */}
      <div className="col-start-3 flex flex-col">

        {/* Hero Text Block */}
        <div className="relative flex flex-col items-center justify-center gap-6 px-4 py-16 text-center md:py-24 lg:py-32">

          {/* Badge */}
          <motion.a
            href="#"
            {...fadeUp(0)}
            className={cn(
              'group relative z-10 mx-auto flex w-fit items-center gap-2 rounded-sm border bg-card px-1 py-1 shadow-sm',
            )}
          >
            <div className="rounded-xs bg-foreground px-2 py-0.5">
              <p className="font-mono text-[10px] font-bold tracking-widest text-background">NEW</p>
            </div>
            <span className="pr-1 text-xs tracking-wider text-muted-foreground uppercase">
              Intelligent Chat
            </span>
            <span className="h-4 border-l border-border" />
            <ArrowRightIcon className="mr-1 size-3 text-muted-foreground" />
          </motion.a>

          {/* Heading */}
          <motion.h1
            {...fadeUp(0.1)}
            className="relative z-10 max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {headingWords.join(' ')}
          </motion.h1>

          {/* Description */}
          <motion.p
            {...fadeUp(0.2)}
            className="relative z-10 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            Experience the future of conversational AI. BotBuddy is here to assist you, answer questions, and boost your productivity in one unified interface.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.3)}
            className="relative z-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/chat">
              <Button size="lg" className="gap-2 font-medium uppercase tracking-widest text-xs px-6">
                Chat with BotBuddy
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2 font-medium uppercase tracking-widest text-xs px-6">
              <PhoneCallIcon className="size-3.5" />
              Learn More
            </Button>
          </motion.div>

        </div>

        {/* Dashed divider */}
        <div
          aria-hidden
          className={cn(
            'w-full border-t border-dashed',
            '[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]',
          )}
        />

        {/* Dashboard Image Block */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          {/* Layer 1 - outer border frame */}
          <div className="mx-4 border-x border-border sm:mx-8 md:mx-12">
            {/* Layer 2 - inner border frame */}
            <div className="mx-3 border-x border-border/50 sm:mx-4">
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src="https://opencal-nextjs.vercel.app/12.png"
                  alt="Dashboard preview"
                  width="auto"
                  height="auto"
                  className="w-full select-none pointer-events-none object-cover object-top"
                />
                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashed divider bottom */}
        <div
          aria-hidden
          className={cn(
            'w-full border-b border-dashed',
            '[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]',
          )}
        />

      </div>
    </section>
  );
}