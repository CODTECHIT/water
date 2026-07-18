import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/king/SiteLayout";
import { CrownIcon } from "@/components/king/CrownIcon";
import aboutDroplet from "@/assets/about-droplet.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — King Water" },
      {
        name: "description",
        content:
          "The story behind King Water — a family-run water brand built on daily TDS testing, sealed dispatch, and quiet reliability.",
      },
      { property: "og:title", content: "About — King Water" },
      {
        property: "og:description",
        content:
          "A family-run water brand built on daily testing, sealed dispatch, and quiet reliability.",
      },
    ],
  }),
});

const reasons = [
  {
    n: "01",
    title: "Tested every single day",
    body: "A fresh TDS and microbial check on every batch, before a single can leaves the plant. The report travels with the crate.",
  },
  {
    n: "02",
    title: "Sealed at source, opened at yours",
    body: "Every can is filled, capped and shrink-sealed at our facility. No hand-transfers between plant and doorstep.",
  },
  {
    n: "03",
    title: "Delivered like clockwork",
    body: "Route-based dispatch with predictable arrival windows — because water is not a surprise, it's a schedule.",
  },
  {
    n: "04",
    title: "Serving those who notice",
    body: "Households with young children, homes caring for elderly parents, offices that pour water for guests — you are our quality control.",
  },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1240px] px-6 pb-16 pt-16 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 text-gold">
              <CrownIcon size={16} />
              <span className="eyebrow !text-gold">Our Story</span>
            </div>
          </div>
          <div className="lg:col-span-9">
            <p className="font-display text-3xl leading-[1.15] text-ink sm:text-4xl lg:text-[52px]">
              <em className="italic text-plum">"</em>We started King Water because we wanted the
              same standard of purity for a stranger's home that we expected for our mother's
              kitchen. That is still the whole business.<em className="italic text-plum">"</em>
            </p>
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-muted-foreground">
              — The founding family
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-hairline bg-white/40">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-28">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px]">
              <img
                src={aboutDroplet}
                alt="A single water droplet rippling in warm light"
                loading="lazy"
                width={1408}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <span className="eyebrow">Why King Water</span>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
              Four quiet promises,
              <br />
              kept every day.
            </h2>

            <ol className="mt-10 divide-y divide-hairline">
              {reasons.map((r) => (
                <li key={r.n} className="grid grid-cols-[64px_1fr] gap-6 py-6">
                  <span className="font-display text-2xl text-gold">{r.n}</span>
                  <div>
                    <h3 className="font-display text-2xl leading-tight text-ink">{r.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Reassurance / elderly + health-conscious */}
      <section className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="eyebrow">For the ones you look after</span>
            <h2 className="mt-4 font-display text-3xl leading-[1.15] text-ink sm:text-4xl lg:text-[44px]">
              Water shouldn't be something
              <br />
              you have to think about.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base leading-relaxed text-muted-foreground">
              A lot of our customers are children, elderly parents, and people managing sensitive
              health. We keep our process simple and boring on purpose — same source, same test,
              same seal, every single day. If anything looks off, the batch doesn't ship.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
