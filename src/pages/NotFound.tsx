import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-300 mb-4">404</p>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-slate-500 mb-6">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
        <Link to="/transaksi" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98]">
          Kembali ke Transaksi
        </Link>
      </div>
    </div>
  );
}
