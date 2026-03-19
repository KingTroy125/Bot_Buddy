'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { name: 'Features', href: '#features' },
  { name: 'Solution', href: '#solution' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40',
        // intersection-2 grid: [fill] [pattern] [content] [pattern] [fill]
        'grid grid-cols-[1fr_1rem_minmax(0,64rem)_1rem_1fr]',
        '[--pattern-fg:color-mix(in_oklab,var(--color-gray-950),transparent_95%)]',
        'dark:[--pattern-fg:color-mix(in_oklab,var(--color-white),transparent_90%)]',
        'animate-in fade-in slide-in-from-top-4 fill-mode-backwards duration-500 ease-out',
      )}
    >
      {/* ── Left patterned strip ── */}
      <div
        aria-hidden
        className={cn(
          'col-start-2 row-span-full border-x',
          '[mask-image:linear-gradient(to_bottom,black_60%,transparent)]',
          'bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]',
          'bg-[size:10px_10px] bg-fixed',
        )}
      />

      {/* ── Right patterned strip ── */}
      <div
        aria-hidden
        className={cn(
          'col-start-4 row-span-full border-x',
          '[mask-image:linear-gradient(to_bottom,black_60%,transparent)]',
          'bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]',
          'bg-[size:10px_10px] bg-fixed',
        )}
      />

      {/* ── Nav content ── */}
      <div className="col-start-3 flex flex-col bg-background/80 backdrop-blur-md">

        {/* Main nav row */}
        <div className="flex items-center justify-between px-6 py-3 lg:py-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-lg hidden sm:inline-block">BotBuddy</span>
          </Link>

          {/* Desktop menu */}
          <ul className="hidden lg:flex gap-8 text-sm">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Right: buttons + mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex gap-2">
              <Link href="/chat">
                <Button size="sm">
                  Start Chatting
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-20 -m-2.5 block cursor-pointer p-2.5 lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Dashed divider under nav — fades to sides */}
        <div
          aria-hidden
          className={cn(
            'w-full border-b border-dashed',
            '[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]',
          )}
        />

        {/* Mobile menu */}
        {menuOpen && (
          <div className="flex flex-col gap-4 px-6 py-4 lg:hidden">
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/chat" className="w-full">
                <Button size="sm" className="w-full">
                  Start Chatting
                </Button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}