import { Link } from "@tanstack/react-router";
import { CrownIcon } from "./CrownIcon";
import { MessageCircle } from "lucide-react";

const WHATSAPP =
  "https://wa.me/918341574346?text=Hi%20King%20Water%2C%20I%27d%20like%20to%20order.";

export function Footer() {
  return (
    <footer className="bg-plum-deep text-cream">
      <div className="mx-auto max-w-[1240px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-gold-soft">
              <CrownIcon size={20} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                King Water
              </span>
            </div>
            <p className="mt-6 max-w-sm font-display text-3xl leading-[1.1] text-cream">
              Purity, delivered to your door.
            </p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-[5px] bg-gold px-5 py-3 text-sm font-semibold text-plum-deep transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle size={16} /> Order on WhatsApp
            </a>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">
              Explore
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/80">
              <li><Link to="/" className="hover:text-cream">Home</Link></li>
              <li><Link to="/products" className="hover:text-cream">Products</Link></li>
              <li><Link to="/about" className="hover:text-cream">About</Link></li>
              <li><Link to="/contact" className="hover:text-cream">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">
              Serving
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/80">
              <li>Households</li>
              <li>Offices</li>
              <li>Events</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">
              Contact
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/80">
              <li>WhatsApp: +91 8341574346</li>
              <li>joel.402g@gmail.com</li>
              <li>FSSAI Registered</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-cream/15 pt-6 text-xs text-cream/60 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} King Water. Water-based beverages.</p>
          <p className="tracking-wide">Crafted with care · Daily TDS Tested</p>
        </div>
      </div>
    </footer>
  );
}
