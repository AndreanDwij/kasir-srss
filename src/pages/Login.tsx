import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { if (isLoggedIn) navigate("/transaksi", { replace: true }); }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) { setError("Username dan password wajib diisi"); return; }
    if (login(username, password)) { navigate("/transaksi"); } else { setError("Username atau password salah"); }
  };

  if (isLoggedIn) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Kasir POS</h1>
          <p className="text-sm text-slate-500 mt-1">Masuk untuk memulai transaksi</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username"
              className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password"
              className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500" />
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-200">
            Masuk
          </button>
          <p className="text-xs text-slate-400 text-center">Demo: kasir / kasir123</p>
        </form>
      </div>
    </div>
  );
}
