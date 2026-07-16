import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, BadgeCheck, Beaker, CheckCircle2, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/king/SiteLayout";
import { CrownIcon } from "@/components/king/CrownIcon";
import { Reveal } from "@/components/king/Reveal";

export const Route = createFileRoute("/report")({
  component: ReportPage,
  head: () => ({
    meta: [
      { title: "Water Quality Report — King Water" },
      { name: "description", content: "View the latest water quality report and claim your cashback." },
    ],
  }),
});

const reportData = [
  { param: "TDS (Total Dissolved Solids)", result: "42", unit: "mg/L", standard: "Max 500 mg/L" },
  { param: "pH Value", result: "7.2", unit: "", standard: "6.5 - 8.5" },
  { param: "Iron (as Fe)", result: "0.02", unit: "mg/L", standard: "Max 0.3 mg/L" },
  { param: "Calcium (as Ca)", result: "12.5", unit: "mg/L", standard: "Max 75 mg/L" },
  { param: "Magnesium (as Mg)", result: "4.8", unit: "mg/L", standard: "Max 30 mg/L" },
  { param: "Chloride (as Cl)", result: "18.2", unit: "mg/L", standard: "Max 250 mg/L" },
  { param: "Fluoride (as F)", result: "0.40", unit: "mg/L", standard: "Max 1.0 mg/L" },
  { param: "Nitrate (as NO3)", result: "1.2", unit: "mg/L", standard: "Max 45 mg/L" },
  { param: "Sulphate (as SO4)", result: "8.5", unit: "mg/L", standard: "Max 200 mg/L" },
];

function ReportPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <SiteLayout>
      {/* SECTION 1: WATER QUALITY REPORT */}
      <section className="bg-cream px-6 py-20 lg:px-10 lg:py-28 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[800px] h-[800px] bg-white rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gold/10 rounded-full opacity-60 blur-3xl" />

        <div className="mx-auto max-w-[1000px] relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <span className="eyebrow inline-flex items-center gap-2 !text-gold mb-4">
                <ShieldCheck size={16} /> Batch Verified
              </span>
              <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-[64px]">
                Quality you can see.<br />
                <em className="italic text-plum">Purity you can taste.</em>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                Every batch of King Water is rigorously tested before it reaches your door. Review the official lab results for your latest delivery below.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-[12px] bg-white shadow-[0_20px_60px_-20px_rgba(51,51,51,0.1)] border border-hairline overflow-hidden">
              {/* Report Header */}
              <div className="border-b border-hairline p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-8 bg-slate-50/50">
                <div>
                  <h2 className="font-display text-3xl text-ink">Official Lab Report</h2>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Sample Name</div>
                      <div className="font-medium text-ink">Packaged Drinking Water</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Report Date</div>
                      <div className="font-medium text-ink">July 16, 2026</div>
                    </div>
                  </div>
                </div>
                
                <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 border border-emerald-100 px-5 py-3 self-start md:self-auto shrink-0">
                  <BadgeCheck className="text-emerald-600" size={24} />
                  <div className="text-left">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Tested & Certified by</div>
                    <div className="font-semibold text-emerald-900 text-sm leading-none mt-0.5">Bureau Veritas</div>
                  </div>
                </div>
              </div>

              {/* TDS Highlight */}
              <div className="p-8 md:p-10 border-b border-hairline bg-gradient-to-br from-gold/10 to-transparent">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-gold mb-3">
                      <Beaker size={20} />
                      <span className="font-semibold tracking-wide uppercase text-sm">Key Purity Metric</span>
                    </div>
                    <h3 className="font-display text-2xl text-ink">Total Dissolved Solids (TDS)</h3>
                    <p className="mt-2 text-muted-foreground text-sm max-w-md">
                      TDS measures the minerals, salts, and metals dissolved in water. A lower number indicates higher purity. The ideal range for drinking water is 30-150 mg/L.
                    </p>
                  </div>
                  <div className="text-center md:text-right shrink-0">
                    <div className="font-display text-[80px] leading-none text-gold">42<span className="text-3xl text-gold/60 ml-2 font-sans tracking-normal">mg/L</span></div>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-100 shadow-sm">
                      <CheckCircle2 size={12} /> Excellent Quality
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="p-8 md:p-10">
                <h3 className="font-display text-2xl text-ink mb-6">Detailed Chemical Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b-2 border-slate-100 text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="pb-4 font-semibold pl-4">Parameter</th>
                        <th className="pb-4 font-semibold text-right">Result</th>
                        <th className="pb-4 font-semibold text-right pr-4">IS 14543 Requirement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reportData.map((row, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-medium text-ink pl-4">{row.param}</td>
                          <td className="py-4 text-right">
                            <span className={row.param.includes("TDS") ? "font-bold text-gold text-lg" : "font-semibold text-ink"}>
                              {row.result}
                            </span>
                            {row.unit && <span className="text-muted-foreground ml-1">{row.unit}</span>}
                          </td>
                          <td className="py-4 text-right text-muted-foreground pr-4">{row.standard}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 2: CLAIM YOUR CASHBACK */}
      <section className="mx-auto max-w-[800px] px-6 py-20 lg:px-10 lg:py-28">
        <Reveal>
          <div className="text-center mb-10">
            <CrownIcon size={32} className="mx-auto text-gold mb-6" />
            <h2 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
              Scan. Claim. <em className="italic text-plum">Get Rewarded.</em>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Thank you for trusting King Water. Enter your details below to claim your cashback on this purchase.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="rounded-[8px] border border-hairline bg-white p-8 md:p-12 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="font-display text-3xl text-ink mb-3">Claim Submitted!</h3>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                  We're verifying your details. Your cashback will be credited to your UPI ID within 24-48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Full Name
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ritika Sharma"
                      className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                    />
                  </label>
                  
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Mobile Number
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                    />
                  </label>
                  
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Email Address
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="you@gmail.com"
                      className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      UPI ID (For Cashback)
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="yourname@upi"
                      className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Pack Type
                    </span>
                    <select
                      required
                      className="mt-2 w-full rounded-[5px] border border-hairline bg-cream px-4 py-3.5 text-base text-ink outline-none transition-all focus:border-plum focus:bg-white focus:ring-2 focus:ring-plum/15"
                    >
                      <option value="" disabled selected>Select your purchased pack</option>
                      <option value="15 cans">15 Cans (₹50 Cashback)</option>
                      <option value="30 cans">30 Cans (₹100 Cashback)</option>
                    </select>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-plum px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-plum-deep shadow-md"
                  >
                    Claim Cashback
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                  <p className="mt-4 text-center text-xs font-medium text-muted-foreground">
                    <ShieldCheck size={12} className="inline mr-1 text-emerald-600 relative -top-[1px]" />
                    Cashback will be credited to your UPI ID within 24-48 hours.
                  </p>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
