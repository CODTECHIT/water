import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Save, BadgeCheck, Beaker, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/king/tds")({
  component: WaterQualityEditor,
  head: () => ({
    meta: [
      { title: "Water Quality Report Editor — King Water Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function WaterQualityEditor() {
  const [reportDate, setReportDate] = useState("2026-07-16");
  const [labName, setLabName] = useState("Bureau Veritas India Testing Services");
  const [sampleName, setSampleName] = useState("Packaged Drinking Water");
  const [ironFe, setIronFe] = useState("0.02");
  const [calciumCa, setCalciumCa] = useState("12.5");
  const [chlorideCl, setChlorideCl] = useState("18.2");
  const [fluorideF, setFluorideF] = useState("0.40");
  const [magnesiumMg, setMagnesiumMg] = useState("4.8");
  const [nitrateNo3, setNitrateNo3] = useState("1.2");
  const [pH, setPH] = useState("7.2");
  const [sulphateSo4, setSulphateSo4] = useState("8.5");
  const [tds, setTds] = useState("42");
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadLatestReport() {
      const { data } = await supabase
        .from("tds_reports")
        .select("*")
        .order("report_date", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        if (data.report_date) setReportDate(data.report_date);
        if (data.tds_value) setTds(data.tds_value.toString());
        if (data.ph_level) setPH(data.ph_level.toString());
        if (data.uploaded_by) setLabName(data.uploaded_by);
      }
      setLoading(false);
    }
    loadLatestReport();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase.from("tds_reports").insert({
      report_date: reportDate,
      tds_value: parseInt(tds, 10) || 0,
      ph_level: parseFloat(pH) || 0,
      uploaded_by: labName,
    });

    if (error) {
      alert("Error saving report: " + error.message);
    } else {
      alert("Report successfully published to the live site!");
    }
    
    setSaving(false);
  };

  const previewData = [
    { param: "TDS (Total Dissolved Solids)", result: tds, unit: "mg/L", standard: "Max 500 mg/L" },
    { param: "pH Value", result: pH, unit: "", standard: "6.5 - 8.5" },
    { param: "Iron (as Fe)", result: ironFe, unit: "mg/L", standard: "Max 0.3 mg/L" },
    { param: "Calcium (as Ca)", result: calciumCa, unit: "mg/L", standard: "Max 75 mg/L" },
    { param: "Magnesium (as Mg)", result: magnesiumMg, unit: "mg/L", standard: "Max 30 mg/L" },
    { param: "Chloride (as Cl)", result: chlorideCl, unit: "mg/L", standard: "Max 250 mg/L" },
    { param: "Fluoride (as F)", result: fluorideF, unit: "mg/L", standard: "Max 1.0 mg/L" },
    { param: "Nitrate (as NO3)", result: nitrateNo3, unit: "mg/L", standard: "Max 45 mg/L" },
    { param: "Sulphate (as SO4)", result: sulphateSo4, unit: "mg/L", standard: "Max 200 mg/L" },
  ];

  const reportDateFormatted = new Date(reportDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AdminShell
      title="Water Quality Report"
      description="Update the live lab report shown to customers on the public QR page."
      actions={
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-md bg-[#8E2A6B] px-4 py-2 text-sm font-medium text-white hover:bg-[#75225a] transition-all disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Publishing..." : "Save & Publish"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Editor Form */}
        <div className="xl:col-span-5 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-5">Report Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700">Report Date</label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Lab Name</label>
                <input
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Sample Name</label>
                <input
                  type="text"
                  value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]"
                />
              </div>
            </div>

            <div className="mt-8 mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Key Metric</h3>
            </div>

            <div className="rounded-md border-2 border-[#B8863B]/30 bg-[#B8863B]/5 p-4 relative">
              <div className="absolute top-0 right-0 bg-[#B8863B] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-bl-md rounded-tr-sm">
                Updates frequently
              </div>
              <label className="text-xs font-bold text-[#8E2A6B] uppercase tracking-wider">
                TDS (Total Dissolved Solids)
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  step="1"
                  value={tds}
                  onChange={(e) => setTds(e.target.value)}
                  className="w-full rounded-md border-2 border-[#B8863B] px-4 py-3 text-2xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-[#B8863B]/20"
                />
                <span className="text-slate-500 font-medium">mg/L</span>
              </div>
            </div>

            <div className="mt-8 mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-base font-semibold text-slate-900">Chemical Analysis</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700">pH Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={pH}
                  onChange={(e) => setPH(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Iron (Fe)</label>
                <input
                  type="number"
                  step="0.01"
                  value={ironFe}
                  onChange={(e) => setIronFe(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Calcium (Ca)</label>
                <input
                  type="number"
                  step="0.1"
                  value={calciumCa}
                  onChange={(e) => setCalciumCa(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Chloride (Cl)</label>
                <input
                  type="number"
                  step="0.1"
                  value={chlorideCl}
                  onChange={(e) => setChlorideCl(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Fluoride (F)</label>
                <input
                  type="number"
                  step="0.01"
                  value={fluorideF}
                  onChange={(e) => setFluorideF(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Magnesium (Mg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={magnesiumMg}
                  onChange={(e) => setMagnesiumMg(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Nitrate (NO3)</label>
                <input
                  type="number"
                  step="0.1"
                  value={nitrateNo3}
                  onChange={(e) => setNitrateNo3(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Sulphate (SO4)</label>
                <input
                  type="number"
                  step="0.1"
                  value={sulphateSo4}
                  onChange={(e) => setSulphateSo4(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="xl:col-span-7">
          <div className="sticky top-24">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Live Public Preview
              </h3>
            </div>
            <div className="rounded-[12px] bg-white shadow-xl border border-slate-200 overflow-hidden scale-[0.85] origin-top lg:scale-100">
              {/* Report Header (From public site) */}
              <div className="border-b border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-50/50">
                <div>
                  <h2 className="font-display text-2xl text-slate-900">Official Lab Report</h2>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Sample Name
                      </div>
                      <div className="font-medium text-slate-900 text-sm">{sampleName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Report Date
                      </div>
                      <div className="font-medium text-slate-900 text-sm">
                        {reportDateFormatted || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-2 self-start md:self-auto shrink-0">
                  <BadgeCheck className="text-emerald-600" size={20} />
                  <div className="text-left">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-800">
                      Tested & Certified by
                    </div>
                    <div className="font-semibold text-emerald-900 text-xs leading-none mt-0.5">
                      {labName || "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* TDS Highlight */}
              <div className="p-6 md:p-8 border-b border-slate-200 bg-gradient-to-br from-[#B8863B]/10 to-transparent">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[#B8863B] mb-2">
                      <Beaker size={16} />
                      <span className="font-semibold tracking-wide uppercase text-xs">
                        Key Purity Metric
                      </span>
                    </div>
                    <h3 className="font-display text-xl text-slate-900">
                      Total Dissolved Solids (TDS)
                    </h3>
                  </div>
                  <div className="text-center md:text-right shrink-0">
                    <div className="font-display text-[64px] leading-none text-[#B8863B]">
                      {tds || "0"}
                      <span className="text-2xl text-[#B8863B]/60 ml-1 font-sans tracking-normal">
                        mg/L
                      </span>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-emerald-600 border border-emerald-100 shadow-sm">
                      <CheckCircle2 size={10} /> Excellent Quality
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="p-6 md:p-8">
                <h3 className="font-display text-lg text-slate-900 mb-4">
                  Detailed Chemical Analysis
                </h3>
                <table className="w-full text-left text-sm">
                  <thead className="border-b-2 border-slate-100 text-[10px] uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="pb-3 font-semibold pl-2">Parameter</th>
                      <th className="pb-3 font-semibold text-right">Result</th>
                      <th className="pb-3 font-semibold text-right pr-2 hidden sm:table-cell">
                        Requirement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewData.map((row, i) => (
                      <tr key={i}>
                        <td className="py-2.5 font-medium text-slate-900 pl-2">{row.param}</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={
                              row.param.includes("TDS")
                                ? "font-bold text-[#B8863B] text-base"
                                : "font-semibold text-slate-900"
                            }
                          >
                            {row.result || "0"}
                          </span>
                          {row.unit && (
                            <span className="text-slate-500 ml-1 text-xs">{row.unit}</span>
                          )}
                        </td>
                        <td className="py-2.5 text-right text-slate-500 pr-2 hidden sm:table-cell text-xs">
                          {row.standard}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
