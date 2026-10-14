import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./Header";
import { Serpent } from "./Serpent";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-soft">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex gap-5 sm:col-span-2">
          <Serpent height={88} className="hidden shrink-0 sm:block" />
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-muted">{site.description}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/shop" className="hover:text-brand">All products</Link></li>
            <li><Link href="/#search" className="hover:text-brand">Search</Link></li>
            <li><Link href="/travelers" className="hover:text-brand">Traveler delivery</Link></li>
            <li><Link href="/membership" className="hover:text-brand">Charter membership</Link></li>
            <li><Link href="/orders/demo" className="hover:text-brand">Track an order (demo)</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Partners</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/sell" className="hover:text-brand">Become a seller</Link></li>
            <li><Link href="/waitlist" className="hover:text-brand">Traveler waitlist</Link></li>
            <li><a href={`mailto:${site.supportEmail}`} className="hover:text-brand">{site.supportEmail}</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-4 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.legalEntity}. {site.name} is a trade name of {site.legalEntity}.
        <span className="block">Demo storefront — products and sellers shown are sample data.</span>
      </p>
    </footer>
  );
}
