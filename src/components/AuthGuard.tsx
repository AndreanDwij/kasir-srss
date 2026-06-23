import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-sm text-slate-500">Mengalihkan ke halaman login...</p></div>;

  return <>{children}</>;
}
