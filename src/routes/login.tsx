import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, MessageCircle, Chrome } from "lucide-react";
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
    ],
  }),
});

const WHATSAPP =
  "https://wa.me/918341574346?text=Hi%20King%20Water%2C%20I%27d%20like%20to%20order.";

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Sign up fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Sign in fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleGoogleSignIn = () => {
    // Supabase OAuth logic goes here
    console.log("Signing in with Google");
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Supabase Email/Password login logic goes here
    console.log("Signing in", { loginEmail, loginPassword });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Supabase Signup logic goes here (create user + insert into public.customers with phone number)
    console.log("Signing up", { name, email, phone, signupPassword });
  };

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
            Sign in to access your dashboard. Your cashback rewards, delivery schedules, and past
            batch reports are waiting inside.
          </p>

          <ul className="mt-10 space-y-4 text-sm text-ink">
            {[
              "Claim cashback the moment you scan a can or bottle",
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
            <span className="eyebrow">{mode === "signin" ? "Sign in" : "Create Account"}</span>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ink">
              {mode === "signin" ? "Sign in to King Water" : "Enter your details"}
            </h2>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="group flex w-full items-center justify-center gap-3 rounded-[5px] border border-hairline bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-plum hover:text-plum hover:shadow-sm"
              >
                <Chrome size={18} />
                Continue with Google
              </button>
            </div>

            <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px flex-1 bg-hairline" />
              or
              <span className="h-px flex-1 bg-hairline" />
            </div>

            {mode === "signin" ? (
              <form className="space-y-5" onSubmit={handleSignIn}>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Email address
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Password
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                  />
                </label>

                <button
                  type="submit"
                  className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-plum px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-plum-deep"
                >
                  Sign in
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-plum underline decoration-gold underline-offset-4"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleSignUp}>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Full Name
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ritika Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                  />
                </label>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Email
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="you@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      WhatsApp Number
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="+91 8341574346"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Password
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                  />
                </label>

                <button
                  type="submit"
                  className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-plum px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-plum-deep"
                >
                  Create account
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-plum underline decoration-gold underline-offset-4"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}

            <div className="mt-8 border-t border-hairline pt-6">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-[5px] border border-hairline bg-cream px-6 py-4 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-plum hover:text-plum"
              >
                <MessageCircle size={16} /> Continue on WhatsApp
              </a>

              <p className="mt-6 text-center text-xs text-muted-foreground">
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
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
