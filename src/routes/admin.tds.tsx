import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Upload, FileText, Trash2, Eye, X } from "lucide-react";

export const Route = createFileRoute("/admin/tds")({
  component: TdsPage,
  head: () => ({ meta: [{ title: "TDS Reports — King Water Admin" }, { name: "robots", content: "noindex" }] }),
});

const reports = [
  { id: 1, date: "Jul 14, 2026", file: "TDS-2026-07-14.pdf", by: "Priya Menon", notes: "Batch A — 42 ppm" },
  { id: 2, date: "Jul 13, 2026", file: "TDS-2026-07-13.pdf", by: "Priya Menon", notes: "Batch A — 41 ppm" },
  { id: 3, date: "Jul 12, 2026", file: "TDS-2026-07-12.pdf", by: "Rahul Verma", notes: "Batch B — 43 ppm" },
  { id: 4, date: "Jul 11, 2026", file: "TDS-2026-07-11.pdf", by: "Rahul Verma", notes: "Batch B — 40 ppm" },
  { id: 5, date: "Jul 10, 2026", file: "TDS-2026-07-10.pdf", by: "Priya Menon", notes: "Batch A — 42 ppm" },
];

function TdsPage() {
  const [open, setOpen] = useState(false);
  return (
    <AdminShell
      title="TDS Reports"
      description="Daily total dissolved solids test uploads."
      actions={
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-[#8E2A6B] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#75225a]"
        >
          <Upload size={14} /> Upload New Report
        </button>
      }
    >
      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">File</th>
              <th className="px-5 py-3">Notes</th>
              <th className="px-5 py-3">Uploaded By</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{r.date}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileText size={14} className="text-[#8E2A6B]" />
                    <span className="text-xs">{r.file}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">{r.notes}</td>
                <td className="px-5 py-3 text-slate-600">{r.by}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><Eye size={14} /></button>
                    <button className="rounded p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Upload TDS Report</h3>
                <p className="text-xs text-slate-500">Add a new daily test result.</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X size={16} /></button>
            </div>
            <form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
              <div>
                <label className="text-xs font-medium text-slate-700">Report date</label>
                <input type="date" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Report file (PDF)</label>
                <div className="mt-1 flex items-center justify-center rounded-md border-2 border-dashed border-slate-300 px-4 py-6 text-center text-xs text-slate-500">
                  <div>
                    <Upload size={18} className="mx-auto mb-1 text-slate-400" />
                    Click to browse or drop a PDF
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Notes</label>
                <textarea rows={3} placeholder="e.g. Batch A — 42 ppm" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-md bg-[#8E2A6B] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#75225a]">Upload report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
