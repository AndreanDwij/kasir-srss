import { useState } from "react";
import { useProducts } from "@/context/ProductContext";

const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export default function LaporanBulananPage() {
  const { products, getMonthlyTransactions } = useProducts();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const monthly = getMonthlyTransactions(selectedMonth, selectedYear);
  const totalRevenue = monthly.reduce((s, t) => s + t.total, 0);
  const totalItemsSold = monthly.reduce((s, t) => s + t.items.reduce((s2, i) => s2 + i.qty, 0), 0);
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 mb-6">Laporan Pendapatan & Stok Bulanan</h1>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500">
          {months.map((m, i) => (<option key={i} value={i}>{m}</option>))}
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500">
          {years.map((y) => (<option key={y} value={y}>{y}</option>))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Pendapatan</p>
          <p className="text-2xl font-bold text-emerald-600">Rp{totalRevenue.toLocaleString("id")}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Transaksi</p>
          <p className="text-2xl font-bold text-slate-900">{monthly.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Item Terjual</p>
          <p className="text-2xl font-bold text-slate-900">{totalItemsSold}</p>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Status Stok Saat Ini</h2>
        <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-100">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Barang</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Harga</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Stok</th>
            </tr></thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-emerald-50/30 transition-colors`}>
                  <td className="px-4 py-3 text-slate-700 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-slate-700">Rp{item.price.toLocaleString("id")}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.stock === 0 ? "bg-red-100 text-red-700" : item.stock <= 5 ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {item.stock === 0 ? "Habis" : item.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {monthly.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Transaksi {months[selectedMonth]} {selectedYear}</h2>
          <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-100">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Waktu</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Total</th>
              </tr></thead>
              <tbody>
                {monthly.map((t, index) => (
                  <tr key={t.id} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-emerald-50/30 transition-colors`}>
                    <td className="px-4 py-3 text-slate-700">{t.id}</td>
                    <td className="px-4 py-3 text-slate-700">{t.date}</td>
                    <td className="px-4 py-3 text-slate-700">{t.time}</td>
                    <td className="px-4 py-3 text-slate-700">{t.items.reduce((s, i) => s + i.qty, 0)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">Rp{t.total.toLocaleString("id")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {monthly.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="text-sm font-medium text-slate-500">Tidak ada transaksi di bulan ini</p>
          <p className="text-xs text-slate-400 mt-1">Pilih bulan dan tahun lain untuk melihat data transaksi.</p>
        </div>
      )}
    </div>
  );
}
