import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle, QrCode } from "lucide-react";
import { SiteLayout } from "@/components/king/SiteLayout";
import { CrownIcon } from "@/components/king/CrownIcon";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Products — King Water" },
      {
        name: "description",
        content:
          "King Water cans and bottles. Editorial-quality purified water for homes and offices.",
      },
      { property: "og:title", content: "Products — King Water" },
      {
        property: "og:description",
        content: "Bulk cans and bottle packs of King Water.",
      },
    ],
  }),
});

const WHATSAPP_BASE = "https://wa.me/918341574346";
const WHATSAPP = `${WHATSAPP_BASE}?text=${encodeURIComponent(
  "Hi King Water, I'd like to place an order."
)}`;

function orderLink(title: string) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(
    `Hi King Water, I'd like to order ${title}. Please share delivery details.`
  )}`;
}

const products = [
  {
    image: "/can.png",
    eyebrow: "Our Signature",
    title: "Water Cans",
    cashback: "Up to ₹100 Cashback",
    body: "Purified water cans, delivered fresh to your doorstep. Best for households and offices. Every can is sealed and TDS-verified for the day of dispatch.",
  },
  {
    image: "/bottles.png",
    eyebrow: "On The Go",
    title: "Water Bottles",
    body: "Purified bottled water for everyday hydration. Sourced responsibly and purified to the highest standard, perfect for events, travel, and personal use.",
  },
];

function ProductsPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1240px] px-6 pb-14 pt-16 lg:px-10 lg:pb-20 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-gold">
              <CrownIcon size={16} />
              <span className="eyebrow !text-gold">Our Selection</span>
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] text-ink sm:text-6xl lg:text-[76px]">
              Pure water.
              <br />
              <em className="italic text-plum">Any way you want it.</em>
            </h1>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:col-span-5 lg:self-end">
            Every can and bottle is filled, sealed and tested at the same facility. The
            only real choice is how much of it you want at your door.
          </p>
        </div>
      </section>

      <section className="border-t border-hairline">
        {products.map((p, i) => (
          <ProductRow key={p.title} product={p} index={i} />
        ))}
      </section>

      {/* CASHBACK HIGHLIGHT SECTION */}
      <section className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="relative overflow-hidden rounded-[12px] bg-gold/10 border border-gold/20 p-8 md:p-14 lg:p-20 text-center">
          <CrownIcon size={32} className="mx-auto text-gold mb-6" />
          <h2 className="font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
            Scan. Order. Earn.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get rewarded for every drop you drink. Claim your cashback effortlessly.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-xl font-medium text-ink">15 Cans</span>
              <span className="mt-2 font-display text-4xl text-gold">₹50 Cashback</span>
            </div>
            <div className="hidden h-16 w-px bg-gold/30 md:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-medium text-ink">30 Cans</span>
              <span className="mt-2 font-display text-4xl text-gold">₹100 Cashback</span>
            </div>
          </div>

          <div className="mt-14 inline-flex items-center gap-4 rounded-full bg-white px-6 py-4 shadow-sm border border-gold/20">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
              <QrCode size={24} />
            </div>
            <p className="text-left font-medium text-ink">
              Scan the QR code on your can <br className="hidden sm:block" />
              to avail this cashback.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-20 lg:px-10 lg:pb-28">
        <div className="grid grid-cols-1 items-center gap-8 rounded-[6px] border border-hairline bg-white/60 p-8 md:grid-cols-12 lg:p-14">
          <div className="md:col-span-8">
            <span className="eyebrow">Bulk & Recurring</span>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
              Setting up a new office or a monthly plan for home?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Message us with your address and how many cans or bottles you go through in a
              week — we'll build a delivery schedule around it and lock in a
              standing cashback.
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-[5px] bg-plum px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-plum-deep"
            >
              <MessageCircle size={16} />
              Talk to us on WhatsApp
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

type ProductData = {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  cashback?: string;
};

function ProductRow({
  product,
  index,
}: {
  product: ProductData;
  index: number;
}) {
  const reversed = index % 2 === 1;
  return (
    <article className="border-b border-hairline">
      <div
        className={`mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-24 ${reversed ? "lg:[&>div:first-child]:order-2" : ""
          }`}
      >
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-secondary">
            <img
              src={product.image}
              alt={`${product.title} of King Water`}
              loading="lazy"
              width={1200}
              height={1408}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="flex items-center justify-between lg:justify-start lg:gap-6">
            <span className="eyebrow">{product.eyebrow}</span>
            {product.cashback && (
              <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-gold/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                <CrownIcon size={11} /> {product.cashback}
              </span>
            )}
          </div>
          <h2 className="mt-4 font-display text-5xl leading-none text-ink sm:text-6xl lg:text-[88px]">
            {product.title}
          </h2>

          <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">
            {product.body}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href={orderLink(product.title)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[5px] bg-plum px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-plum-deep"
            >
              <MessageCircle size={16} /> Order via WhatsApp
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
