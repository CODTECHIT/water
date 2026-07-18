import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/king/SiteLayout";
import { CrownIcon } from "@/components/king/CrownIcon";
import { Reveal } from "@/components/king/Reveal";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — King Water" },
      {
        name: "description",
        content:
          "Get in touch with King Water. Share your order details and we'll continue the conversation on WhatsApp.",
      },
      { property: "og:title", content: "Contact — King Water" },
      {
        property: "og:description",
        content: "Send us your details — we'll pick up the conversation on WhatsApp.",
      },
    ],
  }),
});

const WHATSAPP_NUMBER = "918341574346";

const packs = ["15 Cans (Family Pack)", "30 Cans (Office Pack)", "Custom / Bulk"];

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pack: packs[0],
    message: "",
  });
  const [sent, setSent] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = [
      `Hi King Water — new enquiry from the website.`,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Delivery address: ${form.address}`,
      `Pack of interest: ${form.pack}`,
      form.message ? `\nMessage: ${form.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    setSent(true);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1240px] px-6 pb-8 pt-16 lg:px-10 lg:pb-16 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-gold">
              <CrownIcon size={16} />
              <span className="eyebrow !text-gold">Get in Touch</span>
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] text-ink sm:text-6xl lg:text-[72px]">
              Tell us where to
              <br />
              <em className="italic text-plum">pour the water.</em>
            </h1>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:col-span-5 lg:self-end">
            Fill in a few details and we'll continue the conversation on WhatsApp — usually within
            the hour, during service times.
          </p>
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-16 px-6 py-16 lg:grid-cols-12 lg:gap-20 lg:px-10 lg:py-24">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow">Direct Lines</span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">
              Prefer to skip the form?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We're on WhatsApp for orders, schedules and bulk queries. Email works too — we reply
              the same working day.
            </p>

            <ul className="mt-10 space-y-6 border-t border-hairline pt-8">
              <li>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  WhatsApp
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block font-display text-2xl text-ink hover:text-plum"
                >
                  +91 8341574346
                </a>
              </li>
              <li>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Email
                </p>
                <a
                  href="mailto:joel.402g@gmail.com"
                  className="mt-2 block font-display text-2xl text-ink hover:text-plum"
                >
                  joel.402g@gmail.com
                </a>
              </li>
              <li>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Service Hours
                </p>
                <p className="mt-2 font-display text-2xl text-ink">Mon – Sat · 8am – 8pm</p>
              </li>
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={80}>
            <form
              onSubmit={handleSubmit}
              className="rounded-[6px] border border-hairline bg-white/60 p-6 sm:p-10"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Your name" required>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="field"
                    placeholder="Aarav Sharma"
                  />
                </Field>
                <Field label="WhatsApp number" required>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    pattern="[0-9+ ]{7,}"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="field"
                    placeholder="+91 98xxx xxxxx"
                  />
                </Field>
              </div>

              <div className="mt-6">
                <Field label="Delivery address" required>
                  <textarea
                    required
                    rows={3}
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="field resize-none"
                    placeholder="Flat / Office, Street, Area, City, Pincode"
                  />
                </Field>
              </div>

              <div className="mt-6">
                <Field label="Pack of interest" required>
                  <select
                    required
                    value={form.pack}
                    onChange={(e) => update("pack", e.target.value)}
                    className="field appearance-none"
                  >
                    {packs.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-6">
                <Field label="Anything else (optional)">
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="field resize-none"
                    placeholder="Frequency, timing preferences, bulk quantities…"
                  />
                </Field>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 rounded-[5px] bg-plum px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-plum-deep"
                >
                  <MessageCircle size={16} />
                  Send on WhatsApp
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
                <p className="text-xs text-muted-foreground">
                  Your answers open a pre-filled WhatsApp chat with our team.
                </p>
              </div>

              {sent && (
                <p className="mt-6 rounded-[4px] border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
                  Opening WhatsApp with your details — if nothing pops up,{" "}
                  <Link to="/contact" className="underline">
                    tap send again
                  </Link>
                  .
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
        {label}
        {required && <span className="text-plum">*</span>}
      </span>
      {children}
    </label>
  );
}
