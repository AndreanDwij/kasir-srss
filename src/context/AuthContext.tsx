import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  user: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "kasir_pos_auth";

function getInitialAuth(): { isLoggedIn: boolean; user: string | null } {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return { isLoggedIn: true, user: data.user };
    }
  } catch { /* ignore */ }
  return { isLoggedIn: false, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => getInitialAuth(), []);
  const [isLoggedIn, setIsLoggedIn] = useState(initial.isLoggedIn);
  const [user, setUser] = useState(initial.user);

  const login = useCallback((username: string, password: string) => {
    if (username === "kasir" && password === "kasir123") {
      setIsLoggedIn(true);
      setUser(username);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: username }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({ isLoggedIn, login, logout, user }), [isLoggedIn, login, logout, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
