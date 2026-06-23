import { useState } from "react";
import { useProducts } from "@/context/ProductContext";

export default function StokPage() {
  const { products, addProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = products.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  const resetForm = () => { setFormName(""); setFormPrice(""); setFormStock(""); setFormError(""); };

  const handleSubmit = () => {
    setFormError(""); setSuccessMsg("");
    const name = formName.trim(); const price = parseInt(formPrice, 10); const stock = parseInt(formStock, 10);
    if (!name) { setFormError("Nama barang wajib diisi"); return; }
    if (isNaN(price) || price < 0) { setFormError("Harga jual tidak boleh kosong atau negatif"); return; }
    if (isNaN(stock) || stock < 0) { setFormError("Kuantitas stok tidak boleh kosong atau negatif"); return; }
    const result = addProduct({ name, price, stock });
    if (result.success) { setSuccessMsg(`Barang "${name}" berhasil ditambahkan`); resetForm(); setModalOpen(false); setTimeout(() => setSuccessMsg(""), 3000); }
    else { setFormError(result.error || "Gagal menambah barang"); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-slate-900">Kelola Stok & Katalog</h1>
        <button onClick={() => { resetForm(); setModalOpen(true); }} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Tambah Barang
        </button>
      </div>
      {successMsg && <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">{successMsg}</div>}
      <div className="mb-4">
        <input type="text" placeholder="Cari barang..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500" />
      </div>
      <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-100">
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Barang</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Harga</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Stok</th>
          </tr></thead>
          <tbody>
            {filtered.map((item, index) => (
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
            {filtered.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                <div className="flex flex-col items-center">
                  <svg className="w-10 h-10 mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <p className="text-sm font-medium text-slate-500">Tidak ada barang ditemukan</p>
                  <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian lain atau tambah barang baru.</p>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Tambah Produk Baru</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {formError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{formError}</div>}
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Nama Barang <span className="text-red-500">*</span></label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Masukkan nama barang"
                  className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Harga Jual <span className="text-red-500">*</span></label>
                <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="0" min="0"
                  className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Kuantitas Stok Awal <span className="text-red-500">*</span></label>
                <input type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} placeholder="0" min="0"
                  className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500" /></div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setModalOpen(false)} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:scale-[0.98]">Batal</button>
              <button onClick={handleSubmit} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98]">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
