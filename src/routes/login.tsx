import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/king/SiteLayout";
import { CrownIcon } from "@/components/king/CrownIcon";
import { Reveal } from "@/components/king/Reveal";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Login — King Water" },
      {
        name: "description",
        content:
          "Sign in to your King Water account to claim cashback, track deliveries, and manage your subscription.",
      },
      { property: "og:title", content: "Login — King Water" },
      {
        property: "og:description",
        content:
          "Sign in to King Water to claim cashback and manage deliveries.",
      },
    ],
  }),
});

const WHATSAPP =
  "https://wa.me/919999999999?text=Hi%20King%20Water%2C%20I%27d%20like%20to%20order.";

function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-28">
        <Reveal className="lg:col-span-6">
          <div className="flex items-center gap-2 text-gold">
            <CrownIcon size={16} />
            <span className="eyebrow !text-gold">Members Area</span>
          </div>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] text-ink sm:text-6xl lg:text-[76px]">
            Welcome
            <br />
            <em className="italic text-plum">back.</em>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Sign in with the number your deliveries arrive on. We'll send a
            one-time code — no passwords, no clutter. Your cashback and past
            batch reports are waiting inside.
          </p>

          <ul className="mt-10 space-y-4 text-sm text-ink">
            {[
              "Claim cashback the moment you scan a can",
              "See TDS reports for every batch you received",
              "Pause, resume or reschedule deliveries",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CrownIcon size={14} className="mt-1 shrink-0 text-gold" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-6">
          <div className="rounded-[6px] border border-hairline bg-white p-8 shadow-[0_20px_60px_-30px_rgba(51,51,51,0.18)] lg:p-10">
            <span className="eyebrow">Sign in</span>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ink">
              Use your WhatsApp number
            </h2>

            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!otpSent) setOtpSent(true);
              }}
            >
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Phone number
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  placeholder="+91 99999 99999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                />
              </label>

              {otpSent && (
                <label className="block reveal-up is-visible">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    One-time code
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit code"
                    className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base tracking-[0.4em] text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Sent to {phone || "your phone"}. Didn't get it?{" "}
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-plum underline decoration-gold underline-offset-4"
                    >
                      Try again
                    </button>
                  </p>
                </label>
              )}

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-plum px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-plum-deep"
              >
                {otpSent ? "Verify & sign in" : "Send one-time code"}
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <p className="text-xs text-muted-foreground">
                New to King Water? Just enter your number — an account is
                created the first time you sign in.
              </p>
            </form>

            <div className="my-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px flex-1 bg-hairline" />
              or
              <span className="h-px flex-1 bg-hairline" />
            </div>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[5px] border border-hairline bg-cream px-6 py-4 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-plum hover:text-plum"
            >
              <MessageCircle size={16} /> Continue on WhatsApp
            </a>

            <p className="mt-6 text-xs text-muted-foreground">
              Prefer to browse first?{" "}
              <Link
                to="/products"
                className="text-ink underline decoration-gold underline-offset-4 hover:text-plum"
              >
                See the packs
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
