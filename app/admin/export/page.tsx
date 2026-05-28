"use client";

// app/admin/export/page.tsx
// Admin page for downloading CSV exports of orders, products, customers.

import { useState } from "react";
import { Download, Package, ShoppingCart, Users, FileText, RefreshCw } from "lucide-react";

interface ExportOption {
  type:    string;
  label:   string;
  desc:    string;
  icon:    any;
  color:   string;
}

const EXPORTS: ExportOption[] = [
  {
    type:  "orders",
    label: "Orders Export",
    desc:  "All orders with customer details, status, totals, city, state. Last 5000 orders.",
    icon:  ShoppingCart,
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    type:  "products",
    label: "Products Export",
    desc:  "All products with SKU, price, stock, category, active status.",
    icon:  Package,
    color: "bg-[#eef7e6] border-[#b8d4a0] text-[#3d6b35]",
  },
  {
    type:  "customers",
    label: "Customers Export",
    desc:  "Unique customers aggregated from orders — phone, name, email, total spent, order count.",
    icon:  Users,
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
];

export default function AdminExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (type: string) => {
    setDownloading(type);
    try {
      const res = await fetch(`/api/admin/export?type=${type}`);
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Export failed. Please try again.");
        return;
      }
      const blob     = await res.blob();
      const url      = URL.createObjectURL(blob);
      const a        = document.createElement("a");
      const filename = res.headers.get("Content-Disposition")
        ?.split("filename=")[1]
        ?.replace(/"/g, "")
        ?? `kavin-${type}.csv`;
      a.href     = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#1e3d18]">Export Data</h2>
        <p className="text-sm text-[#7a9e6a] mt-0.5">
          Download your store data as CSV files. Open in Excel or Google Sheets.
        </p>
      </div>

      {/* Info box */}
      <div className="bg-[#f8faf6] border border-[#dce8d4] rounded-2xl px-5 py-4 flex items-start gap-3">
        <FileText size={18} className="text-[#3d6b35] shrink-0 mt-0.5" />
        <div className="text-sm text-[#5a8a50]">
          <p className="font-bold text-[#1e3d18] mb-0.5">How to use</p>
          <p>Click Download on any option below. The file will save to your Downloads folder.
            Open it in Microsoft Excel, Google Sheets, or any spreadsheet app.
            Data is live from your database at the moment of download.</p>
        </div>
      </div>

      {/* Export options */}
      <div className="flex flex-col gap-4">
        {EXPORTS.map((exp) => {
          const Icon = exp.icon;
          return (
            <div
              key={exp.type}
              className={`bg-white rounded-2xl border-2 p-5 flex items-center gap-4 ${exp.color}`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1e3d18] text-base">{exp.label}</p>
                <p className="text-xs text-[#7a9e6a] mt-0.5 leading-relaxed">{exp.desc}</p>
              </div>
              <button
                onClick={() => handleDownload(exp.type)}
                disabled={downloading === exp.type}
                className="flex items-center gap-2 bg-[#3d6b35] hover:bg-[#2d5228] disabled:bg-[#a8c890] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shrink-0 whitespace-nowrap"
              >
                {downloading === exp.type ? (
                  <><RefreshCw size={14} className="animate-spin" />Downloading…</>
                ) : (
                  <><Download size={14} />Download CSV</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-[#dce8d4] p-5 text-sm text-[#5a8a50] space-y-2">
        <p className="font-bold text-[#1e3d18]">Notes</p>
        <ul className="space-y-1.5 text-xs">
          <li>• Orders export includes up to 5,000 most recent orders.</li>
          <li>• Customers export aggregates all unique phone numbers from orders — not a separate customer database.</li>
          <li>• All amounts are in Indian Rupees (Rs.).</li>
          <li>• Dates are formatted as DD/MM/YYYY (Indian format).</li>
          <li>• If a field is empty it means the customer did not provide it.</li>
        </ul>
      </div>
    </div>
  );
}