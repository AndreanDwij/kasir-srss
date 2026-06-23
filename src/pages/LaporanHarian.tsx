import { useState } from "react";
import { useProducts, type Transaction } from "@/context/ProductContext";

export default function LaporanHarianPage() {
  const { products, getDailyTransactions } = useProducts();
  const daily = getDailyTransactions();
  const totalRevenue = daily.reduce((s, t) => s + t.total, 0);
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 mb-6">Laporan Pendapatan & Stok Harian</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Pendapatan</p>
          <p className="text-2xl font-bold text-emerald-600">Rp{totalRevenue.toLocaleString("id")}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Transaksi Hari Ini</p>
          <p className="text-2xl font-bold text-slate-900">{daily.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Rata-rata Transaksi</p>
          <p className="text-2xl font-bold text-slate-900">Rp{(daily.length > 0 ? totalRevenue / daily.length : 0).toLocaleString("id")}</p>
        </div>
      </div>
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Peringatan Stok</h2>
          <div className="flex flex-wrap gap-2">
            {outOfStock.map((p) => (<span key={p.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200"><span className="w-2 h-2 rounded-full bg-red-500" />{p.name} - Habis</span>))}
            {lowStock.map((p) => (<span key={p.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200"><span className="w-2 h-2 rounded-full bg-yellow-500" />{p.name} - Sisa {p.stock}</span>))}
          </div>
        </div>
      )}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Sisa Stok Terkini</h2>
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
      {daily.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Transaksi Hari Ini</h2>
          <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-100">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Waktu</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Total</th>
              </tr></thead>
              <tbody>
                {daily.map((t: Transaction, index: number) => (
                  <TxRow key={t.id} t={t} index={index} expanded={expandedTx === t.id} onToggle={() => setExpandedTx((prev) => prev === t.id ? null : t.id)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {daily.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <p className="text-sm font-medium text-slate-500">Belum ada transaksi hari ini</p>
          <p className="text-xs text-slate-400 mt-1">Data akan muncul setelah ada transaksi penjualan.</p>
        </div>
      )}
    </div>
  );
}

function TxRow({ t, index, expanded, onToggle }: { t: Transaction; index: number; expanded: boolean; onToggle: () => void }) {
  return (
    <>
      <tr onClick={onToggle} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-emerald-50/30 transition-colors cursor-pointer`}>
        <td className="px-4 py-3 text-slate-700">{t.id}</td>
        <td className="px-4 py-3 text-slate-700">{t.time}</td>
        <td className="px-4 py-3 text-slate-700">{t.items.reduce((s, i) => s + i.qty, 0)}</td>
        <td className="px-4 py-3 font-medium text-slate-900">Rp{t.total.toLocaleString("id")}</td>
      </tr>
      {expanded && (
        <tr><td colSpan={4} className="px-4 py-3 bg-slate-50 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-600 mb-2">Detail Item:</p>
          <div className="space-y-1">
            {t.items.map((item) => (<div key={item.productId} className="flex justify-between text-xs text-slate-600"><span>{item.name} x{item.qty}</span><span>Rp{(item.price * item.qty).toLocaleString("id")}</span></div>))}
          </div>
        </td></tr>
      )}
    </>
  );
}
