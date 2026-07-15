import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/king/SiteLayout";
import { CrownIcon } from "@/components/king/CrownIcon";
import product15 from "@/assets/product-15.jpg";
import product30 from "@/assets/product-30.jpg";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Products — King Water" },
      {
        name: "description",
        content:
          "King Water 15-can and 30-can packs. Editorial-quality purified water for homes and offices, with cashback on every order.",
      },
      { property: "og:title", content: "Products — King Water" },
      {
        property: "og:description",
        content:
          "15-can and 30-can packs of King Water, with cashback on every order.",
      },
    ],
  }),
});

const WHATSAPP_BASE = "https://wa.me/919999999999";
const WHATSAPP = `${WHATSAPP_BASE}?text=${encodeURIComponent(
  "Hi King Water, I'd like to place an order."
)}`;

const products = [
  {
    image: product15,
    eyebrow: "Family Pack",
    title: "15 Cans",
    cashback: "₹40 cashback",
    body: "Best for a household of two to four. Delivered in a single crate, sealed and TDS-verified for the day of dispatch.",
    features: [
      "1L cans, sealed at source",
      "Same-day dispatch in service areas",
      "Daily TDS report on request",
    ],
  },
  {
    image: product30,
    eyebrow: "Office Pack",
    title: "30 Cans",
    cashback: "₹90 cashback",
    body: "Sized for offices and larger homes. Two crates, stacked and delivered together, with a printed batch report in every consignment.",
    features: [
      "1L cans, sealed at source",
      "Priority delivery window",
      "Printed batch report per order",
    ],
  },
];

function orderLink(title: string) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(
    `Hi King Water, I'd like to order the ${title} pack. Please share delivery details.`
  )}`;
}


function ProductsPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1240px] px-6 pb-14 pt-16 lg:px-10 lg:pb-20 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-gold">
              <CrownIcon size={16} />
              <span className="eyebrow !text-gold">The Packs</span>
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] text-ink sm:text-6xl lg:text-[76px]">
              Two packs.
              <br />
              <em className="italic text-plum">One standard.</em>
            </h1>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:col-span-5 lg:self-end">
            Every can is filled, sealed and tested at the same facility. The
            only real choice is how much of it you want at your door.
          </p>
        </div>
      </section>

      <section className="border-t border-hairline">
        {products.map((p, i) => (
          <ProductRow key={p.title} product={p} index={i} />
        ))}
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-8 rounded-[6px] border border-hairline bg-white/60 p-8 md:grid-cols-12 lg:p-14">
          <div className="md:col-span-8">
            <span className="eyebrow">Bulk & Recurring</span>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
              Setting up a new office or a monthly plan for home?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Message us with your address and how many cans you go through in a
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

function ProductRow({
  product,
  index,
}: {
  product: (typeof products)[number];
  index: number;
}) {
  const reversed = index % 2 === 1;
  return (
    <article className="border-b border-hairline">
      <div
        className={`mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-24 ${
          reversed ? "lg:[&>div:first-child]:order-2" : ""
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
          <span className="eyebrow">{product.eyebrow}</span>
          <h2 className="mt-4 font-display text-5xl leading-none text-ink sm:text-6xl lg:text-[88px]">
            {product.title}
          </h2>

          <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">
            {product.body}
          </p>

          <ul className="mt-8 space-y-3 text-sm text-ink">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CrownIcon size={13} className="mt-1 shrink-0 text-gold" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href={orderLink(product.title)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[5px] bg-plum px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-plum-deep"
            >
              <MessageCircle size={16} /> Order Now
              <ArrowUpRight size={16} />
            </a>
            <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-gold/15 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
              <CrownIcon size={11} /> {product.cashback} on every order
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
