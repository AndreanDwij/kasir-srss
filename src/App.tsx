import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import LoginPage from "@/pages/Login";
import DashboardLayout from "@/pages/DashboardLayout";
import TransaksiPage from "@/pages/Transaksi";
import StokPage from "@/pages/Stok";
import LaporanHarianPage from "@/pages/LaporanHarian";
import LaporanBulananPage from "@/pages/LaporanBulanan";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/transaksi" replace />} />
              <Route path="transaksi" element={<TransaksiPage />} />
              <Route path="stok" element={<StokPage />} />
              <Route path="laporan/harian" element={<LaporanHarianPage />} />
              <Route path="laporan/bulanan" element={<LaporanBulananPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
