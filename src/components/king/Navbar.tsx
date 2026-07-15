import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3 lg:px-10">
        <Link to="/" className="flex items-center gap-2" aria-label="King Water — home">
          <img
            src="/logo.png"
            alt="King Water Logo"
            className="h-10 w-auto md:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[13px] font-medium tracking-wide text-ink transition-colors hover:text-plum"
              activeProps={{ className: "text-plum" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="text-[13px] font-medium tracking-wide text-muted-foreground transition-colors hover:text-plum"
            activeProps={{ className: "text-plum" }}
          >
            Login
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-ink"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline bg-cream md:hidden">
          <nav className="mx-auto flex max-w-[1240px] flex-col px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-ink"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-muted-foreground"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
