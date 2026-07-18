import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import QRCode from "react-qr-code";
import { Download, Link as LinkIcon, Printer } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/king/qr")({
  component: QRCodePage,
  head: () => ({
    meta: [{ title: "QR Codes — King Water Admin" }, { name: "robots", content: "noindex" }],
  }),
});

function QRCodePage() {
  const [url, setUrl] = useState("https://kingwater.com/report");

  const downloadQR = () => {
    const svg = document.getElementById("QRCode");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Add padding to the downloaded image
    const padding = 40;
    canvas.width = 1000 + padding * 2;
    canvas.height = 1000 + padding * 2;

    img.onload = () => {
      if (!ctx) return;
      // Draw white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw QR code in center
      ctx.drawImage(img, padding, padding, 1000, 1000);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "king-water-report-qr.png";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const downloadSVG = () => {
    const svg = document.getElementById("QRCode");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "king-water-report-qr.svg";
    downloadLink.click();
  };

  return (
    <AdminShell
      title="QR Code Generator"
      description="Generate and download the QR code for your product packaging."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-5">QR Code Configuration</h3>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block flex items-center gap-2">
                  <LinkIcon size={14} /> Target URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourwebsite.com/report"
                  className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
                />
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  This is the web address customers will be directed to when they scan the QR code.
                  Make sure it points to the public Water Quality Report page.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Download Formats</h4>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={downloadQR}
                    className="flex w-full items-center justify-between gap-3 rounded-md border-2 border-[#8E2A6B] bg-white px-4 py-3 text-sm font-semibold text-[#8E2A6B] hover:bg-[#8E2A6B]/5 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Download size={18} /> Download as PNG (Image)
                    </span>
                    <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-1 bg-slate-100 rounded text-slate-600">
                      Best for web/social
                    </span>
                  </button>
                  <button
                    onClick={downloadSVG}
                    className="flex w-full items-center justify-between gap-3 rounded-md bg-[#8E2A6B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#75225a] transition-colors shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Printer size={18} /> Download as SVG (Vector)
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/20 rounded text-white">
                      Best for printing
                    </span>
                  </button>
                </div>
              </div>

              <div className="rounded-md bg-amber-50 p-4 border border-amber-100 mt-2">
                <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                  Printing Guidelines
                </h5>
                <ul className="text-xs text-amber-900/80 space-y-1 list-disc pl-4">
                  <li>
                    Always download the <strong>SVG vector format</strong> when sending to your
                    packaging printer.
                  </li>
                  <li>Ensure high contrast (dark QR code on light background).</li>
                  <li>Do not print smaller than 2cm x 2cm.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-7">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
              Preview
            </h3>
            <div className="rounded-[12px] bg-slate-200/50 border border-slate-200 p-8 flex items-center justify-center min-h-[400px]">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                <QRCode
                  id="QRCode"
                  title="King Water Quality Report"
                  value={url}
                  size={256}
                  level="H" // High error correction so it scans easily even if slightly damaged on a can
                  bgColor="#FFFFFF"
                  fgColor="#0f172a" // Very dark slate, almost black
                />
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-4">
              Use your phone's camera right now to test the scan.
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
