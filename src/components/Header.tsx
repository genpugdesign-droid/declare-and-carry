"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { useCart } from "./CartProvider";
import { Serpent } from "./Serpent";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/travelers", label: "Request an item" },
  { href: "/waitlist", label: "Carry & earn" },
  { href: "/membership", label: "Membership" },
  { href: "/why", label: "Why prices rose" },
];

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-ink" aria-label={site.name}>
      <Serpent height={30} title="" />
      <span className="font-serif text-[1.65rem] leading-none tracking-tight" aria-hidden>
        Declare <em className="text-accent">&amp;</em> Carry
      </span>
    </span>
  );
}

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="ml-6 hidden gap-6 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm font-medium transition-colors hover:text-brand ${
                pathname.startsWith(n.href) ? "text-brand" : "text-muted"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/sell"
            className="hidden h-10 items-center rounded-full border border-accent px-4 text-sm font-semibold text-accent hover:bg-accent hover:text-white lg:flex"
          >
            Sell with us
          </Link>
          <Link
            href="/cart"
            className="relative flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-brand"
            onClick={() => setOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6h15l-2 9H8L6 3H3" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="rounded-full bg-accent px-2 text-xs font-semibold text-white">{count}</span>
            )}
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-surface px-4 py-2 md:hidden">
          <Link
            href="/sell"
            onClick={() => setOpen(false)}
            className="my-2 flex h-11 items-center justify-center rounded-xl bg-accent font-semibold text-white"
          >
            Sell your US stock with us
          </Link>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-3 text-base font-medium text-ink hover:bg-soft"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
