import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle, ShieldCheck, Droplets, Truck, BadgeCheck } from "lucide-react";
import { SiteLayout } from "@/components/king/SiteLayout";
import { CrownIcon } from "@/components/king/CrownIcon";
import { Reveal } from "@/components/king/Reveal";
import heroWater from "@/assets/hero-water.jpg";
import aboutDroplet from "@/assets/about-droplet.jpg";
import product15 from "@/assets/product-15.jpg";
import product30 from "@/assets/product-30.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "King Water — Purity Fit for Royalty" },
      {
        name: "description",
        content:
          "Purified water and water-based beverages delivered to households and offices. Order the 15 or 30 can pack on WhatsApp.",
      },
    ],
  }),
});

const WHATSAPP =
  "https://wa.me/919999999999?text=Hi%20King%20Water%2C%20I%27d%20like%20to%20order.";

const trustBadges = [
  { icon: Droplets, label: "Daily TDS Tested" },
  { icon: BadgeCheck, label: "FSSAI Registered" },
  { icon: Truck, label: "On-Time Delivery" },
  { icon: ShieldCheck, label: "Sealed at Source" },
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-6 pb-16 pt-14 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pb-28 lg:pt-24">
          <div className="lg:col-span-7 lg:pr-8">
            <div className="reveal flex items-center gap-2 text-gold" style={{ animationDelay: "0.05s" }}>
              <CrownIcon size={16} />
              <span className="eyebrow !text-gold">A Royal Standard of Purity</span>
            </div>

            <h1
              className="reveal mt-6 font-display text-[44px] leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[80px]"
              style={{ animationDelay: "0.12s" }}
            >
              Purity fit
              <br />
              for <em className="italic text-plum">royalty.</em>
            </h1>

            <p
              className="reveal mt-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "0.2s" }}
            >
              King Water delivers purified drinking water and water-based beverages
              to homes and offices — daily TDS tested, sealed at source, and
              carried straight to your doorstep.
            </p>

            <div className="reveal mt-10 flex flex-wrap items-center gap-6" style={{ animationDelay: "0.28s" }}>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-[5px] bg-plum px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-plum-deep"
              >
                <MessageCircle size={16} />
                Order on WhatsApp
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <Link
                to="/products"
                className="text-sm font-medium text-ink underline decoration-gold decoration-2 underline-offset-8 transition-colors hover:text-plum"
              >
                Browse the packs
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-secondary lg:translate-y-6">
              <img
                src={heroWater}
                alt="Pure water splashing into a still surface"
                width={1408}
                height={1600}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -left-6 -top-6 hidden h-24 w-24 rounded-full border border-gold/40 lg:block" />
            <div className="absolute -bottom-8 -right-4 hidden font-display text-[120px] leading-none text-plum/10 lg:block">
              W
            </div>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div className="border-y border-hairline bg-cream/60">
          <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-6 px-6 py-6 md:grid-cols-4 lg:px-10">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <b.icon size={18} className="shrink-0 text-plum" strokeWidth={1.6} />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT HIGHLIGHT */}
      <section className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
        <Reveal>
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="eyebrow">Packs</span>
              <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
                Two ways to
                <br />
                stock your kingdom.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:col-span-5">
              Pick a pack that suits your household or office. Both include
              same-day dispatch and a cashback reward on every subscription.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
          <Reveal delay={80}>
            <ProductCard
              image={product15}
              eyebrow="Family Pack"
              title="15 Cans"
              price="₹450"
              cashback="₹40 cashback"
              note="Ideal for a household of 2–4."
            />
          </Reveal>
          <Reveal delay={200}>
            <ProductCard
              image={product30}
              eyebrow="Office Pack"
              title="30 Cans"
              price="₹850"
              cashback="₹90 cashback"
              featured
              note="Best for offices and larger homes."
            />
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-12 flex justify-center">
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-gold decoration-2 underline-offset-8 transition-colors hover:text-plum"
          >
            See all packs & pricing
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="border-t border-hairline bg-white/40">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-28">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px]">
              <img
                src={aboutDroplet}
                alt="A single water droplet rippling in warm light"
                loading="lazy"
                width={1408}
                height={1200}
                className="h-full w-full object-cover"
              />
              <div className="drift absolute -right-5 -top-5 hidden h-24 w-24 rounded-full border border-gold/50 lg:block" />
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7 lg:pl-6">
            <div className="flex items-center gap-2 text-gold">
              <CrownIcon size={16} />
              <span className="eyebrow !text-gold">Our Story</span>
            </div>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              A family standard,
              <br />
              <em className="italic text-plum">poured into every can.</em>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              King Water started with one rule — the same purity we expect for
              our own kitchen is the only purity we send to yours. Every batch
              is TDS tested, sealed at source, and dispatched on a schedule
              you can trust.
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-3 text-sm text-ink sm:grid-cols-2">
              {[
                "Tested every single day",
                "Sealed at source, opened at yours",
                "Delivered like clockwork",
                "Serving households & offices",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CrownIcon size={13} className="mt-1 shrink-0 text-gold" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/about"
              className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-gold decoration-2 underline-offset-8 transition-colors hover:text-plum"
            >
              Read the full story
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>


      {/* QR / DIGITAL SECTION */}
      <section className="border-t border-hairline bg-white/40">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-28">
          <div className="lg:col-span-7">
            <span className="eyebrow">Go Digital</span>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
              Every can carries a code
              <br />
              <em className="italic text-plum">that talks back.</em>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Scan the QR on your can to trace its source, view the day's TDS
              report, and instantly claim your cashback. No apps, no accounts —
              just a receipt of trust.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-ink">
              <QrPoint>Batch traceability with a single scan</QrPoint>
              <QrPoint>Verified test reports for every dispatch</QrPoint>
              <QrPoint>Instant cashback credited to your wallet</QrPoint>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto grid aspect-square max-w-sm place-items-center rounded-[6px] border border-hairline bg-cream p-6">
              <QrPlaceholder />
              <div className="absolute -top-3 left-6 bg-cream px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-plum">
                Scan · Verify · Claim
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ProductCard({
  image,
  eyebrow,
  title,
  price,
  cashback,
  note,
  featured,
}: {
  image: string;
  eyebrow: string;
  title: string;
  price: string;
  cashback: string;
  note: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[6px] border border-hairline bg-white transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(51,51,51,0.18)] ${
        featured ? "md:translate-y-8" : ""
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <img
          src={image}
          alt={`${title} of King Water`}
          loading="lazy"
          width={1200}
          height={1408}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-5 p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <span className="eyebrow">{eyebrow}</span>
          <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-gold/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
            <CrownIcon size={11} /> {cashback}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-4xl leading-none text-ink lg:text-5xl">{title}</h3>
          <p className="font-display text-4xl leading-none text-plum lg:text-5xl">{price}</p>
        </div>
        <p className="text-sm text-muted-foreground">{note}</p>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-2 self-start text-sm font-semibold text-ink underline decoration-plum decoration-2 underline-offset-8 transition-colors hover:text-plum"
        >
          Order this pack <ArrowUpRight size={14} />
        </a>
      </div>
    </article>
  );
}

function QrPoint({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CrownIcon size={14} className="mt-1 shrink-0 text-gold" />
      <span>{children}</span>
    </li>
  );
}

function QrPlaceholder() {
  // Editorial QR placeholder — CSS grid of squares (no external asset needed).
  const cells = Array.from({ length: 25 * 25 });
  return (
    <div
      className="grid h-56 w-56 gap-[2px] rounded-[4px] bg-cream p-2 sm:h-64 sm:w-64"
      style={{ gridTemplateColumns: "repeat(25, minmax(0, 1fr))" }}
      aria-label="QR code placeholder"
    >
      {cells.map((_, i) => {
        const x = i % 25;
        const y = Math.floor(i / 25);
        const inCorner =
          (x < 7 && y < 7) ||
          (x > 17 && y < 7) ||
          (x < 7 && y > 17);
        const cornerRing =
          inCorner &&
          ((x === 0 || x === 6 || y === 0 || y === 6 ||
            x === 18 || x === 24 || y === 18 || y === 24 ||
            (x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
            (x >= 20 && x <= 22 && y >= 2 && y <= 4) ||
            (x >= 2 && x <= 4 && y >= 20 && y <= 22)));
        const noise = ((x * 7 + y * 13 + x * y) % 5) < 2;
        const filled = cornerRing || (!inCorner && noise);
        return (
          <span
            key={i}
            className={filled ? "bg-ink" : ""}
            style={{ borderRadius: 1 }}
          />
        );
      })}
    </div>
  );
}
