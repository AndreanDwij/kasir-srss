import { useState, useRef, useEffect, useCallback } from "react";
import { useProducts } from "@/context/ProductContext";

interface CartItem { id: string; name: string; price: number; qty: number; stock: number; }

export default function TransaksiPage() {
  const { products, deductStock, addTransaction } = useProducts();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTx, setLastTx] = useState<{ items: CartItem[]; total: number; payment: number; change: number; time: string } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = useCallback((product: (typeof products)[0]) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) { if (existing.qty >= product.stock) return prev; return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i); }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, stock: product.stock }];
    });
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty < 1) return prev.filter((i) => i.id !== id);
      if (newQty > item.stock) return prev;
      return prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i));
    });
  }, []);

  const removeItem = useCallback((id: string) => { setCart((prev) => prev.filter((i) => i.id !== id)); }, []);

  const handlePayment = useCallback(() => {
    const amount = parseInt(paymentAmount.replace(/\D/g, ""), 10);
    if (isNaN(amount) || amount < subtotal) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("sv-SE");
    const txItems = cart.map((i) => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty }));
    addTransaction({ id: `TRX-${Date.now()}`, time: timeStr, date: dateStr, items: txItems, total: subtotal });
    deductStock(txItems);
    setLastTx({ items: [...cart], total: subtotal, payment: amount, change: amount - subtotal, time: timeStr });
    setCart([]); setPaymentOpen(false); setPaymentAmount(""); setShowReceipt(true);
  }, [paymentAmount, cart, subtotal, deductStock, addTransaction]);

  const handlePrint = useCallback(() => { window.print(); setShowReceipt(false); setLastTx(null); }, []);
  const closeReceipt = useCallback(() => { setShowReceipt(false); setLastTx(null); }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "F2" || (e.ctrlKey && e.key === "c")) { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "F9" && cart.length > 0 && !paymentOpen) { e.preventDefault(); setPaymentOpen(true); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [cart.length, paymentOpen]);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <input ref={searchRef} type="text" placeholder="Cari produk... (F2 / Ctrl+C)" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((product) => (
              <button key={product.id} onClick={() => addToCart(product)} disabled={product.stock <= 0}
                className={`bg-white border border-slate-200 rounded-lg p-3 text-left transition-all duration-150 ${product.stock > 0 ? "hover:shadow-md hover:border-emerald-300 cursor-pointer active:scale-[0.98]" : "opacity-60 cursor-not-allowed"}`}>
                <div className="aspect-square bg-slate-100 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-3xl font-bold text-slate-300">{product.name.charAt(0)}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm font-bold text-emerald-600">Rp{product.price.toLocaleString("id")}</span>
                  {product.stock <= 5 && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${product.stock === 0 ? "text-red-600 bg-red-50" : "text-yellow-600 bg-yellow-50"}`}>
                      {product.stock === 0 ? "Habis" : `Sisa ${product.stock}`}
                    </span>
                  )}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
                <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <p className="text-sm font-medium text-slate-500 mb-1">Produk tidak ditemukan</p>
                <p className="text-xs text-slate-400 text-center max-w-xs">Pastikan ejaan nama barang sudah benar atau daftarkan produk baru di menu Kelola Stok.</p>
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-96 bg-white rounded-xl shadow-md border border-slate-200 flex flex-col lg:sticky lg:top-0 lg:h-[calc(100vh-4rem)]">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Keranjang Belanja</h2>
            {cart.length > 0 && <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{cart.reduce((s, i) => s + i.qty, 0)} item</span>}
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">Rp{item.price.toLocaleString("id")} x {item.qty}</p>
                  <p className="text-xs font-medium text-emerald-600">Rp{(item.price * item.qty).toLocaleString("id")}</p>
                </div>
                <div className="flex items-center gap-1.5 ml-3">
                  <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-md border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors">-</button>
                  <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} disabled={item.qty >= item.stock} className="w-7 h-7 rounded-md border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">+</button>
                  <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-md flex items-center justify-center text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors ml-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                <p className="text-sm font-medium text-slate-500">Keranjang masih kosong</p>
                <p className="text-xs text-slate-400 mt-1">Klik produk di katalog untuk menambahkan ke keranjang</p>
              </div>
            )}
          </div>
          <div className="border-t border-slate-200 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total</span>
              <span className="text-xl font-bold text-slate-900">Rp{subtotal.toLocaleString("id")}</span>
            </div>
            <button onClick={() => setPaymentOpen(true)} disabled={cart.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed">
              Bayar (F9)
            </button>
          </div>
        </div>
      </div>
      {paymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" onClick={() => setPaymentOpen(false)}>
          <div className="w-full max-w-sm bg-white rounded-xl shadow-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Pembayaran</h2>
              <button onClick={() => setPaymentOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div><p className="text-sm text-slate-600 mb-1">Total Tagihan</p><p className="text-2xl font-bold text-slate-900">Rp{subtotal.toLocaleString("id")}</p></div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Uang Diterima</label>
                <input type="text" autoFocus value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handlePayment(); }} placeholder="Masukkan jumlah uang"
                  className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500" />
              </div>
              {paymentAmount && (
                parseInt(paymentAmount.replace(/\D/g, ""), 10) >= subtotal ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3"><p className="text-xs text-emerald-600 mb-1">Kembalian</p><p className="text-lg font-bold text-emerald-700">Rp{(parseInt(paymentAmount.replace(/\D/g, ""), 10) - subtotal).toLocaleString("id")}</p></div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-xs text-red-600">Uang tidak cukup. Kurang Rp{(subtotal - parseInt(paymentAmount.replace(/\D/g, ""), 10)).toLocaleString("id")}</p></div>
                )
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setPaymentOpen(false)} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:scale-[0.98]">Batal</button>
              <button onClick={handlePayment} disabled={!paymentAmount || parseInt(paymentAmount.replace(/\D/g, ""), 10) < subtotal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed">
                Cetak Struk (Enter)
              </button>
            </div>
          </div>
        </div>
      )}
      {showReceipt && lastTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-lg mx-4 print:shadow-none print:border-0">
            <div className="px-6 py-4 border-b border-slate-200 print:border-b print:border-dashed">
              <div className="text-center">
                <h2 className="text-lg font-bold text-slate-900">TOKO KASIR</h2>
                <p className="text-xs text-slate-500 mt-1">Jl. Contoh No. 123</p>
                <p className="text-xs text-slate-500">Telp: 08123456789</p>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span>Tanggal: {new Date().toLocaleDateString("id-ID")}</span>
                <span>{lastTx.time}</span>
              </div>
              <div className="border-t border-dashed border-slate-200 pt-3 space-y-2">
                {lastTx.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-700">{item.name} x{item.qty}</span>
                    <span className="font-medium text-slate-900">Rp{(item.price * item.qty).toLocaleString("id")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-slate-200 mt-3 pt-3 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-slate-600">Total</span><span className="font-bold text-slate-900">Rp{lastTx.total.toLocaleString("id")}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">Bayar</span><span className="text-slate-900">Rp{lastTx.payment.toLocaleString("id")}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">Kembalian</span><span className="font-medium text-emerald-600">Rp{lastTx.change.toLocaleString("id")}</span></div>
              </div>
              <div className="border-t border-dashed border-slate-200 mt-3 pt-3 text-center"><p className="text-xs text-slate-500">Terima kasih atas kunjungan Anda</p></div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 print:hidden">
              <button onClick={closeReceipt} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:scale-[0.98]">Tutup</button>
              <button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Cetak Struk
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
