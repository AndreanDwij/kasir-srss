import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface TransactionItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Transaction {
  id: string;
  time: string;
  date: string;
  items: TransactionItem[];
  total: number;
}

interface ProductContextType {
  products: Product[];
  transactions: Transaction[];
  addProduct: (product: Omit<Product, "id">) => { success: boolean; error?: string };
  deductStock: (items: TransactionItem[]) => void;
  addTransaction: (transaction: Transaction) => void;
  getDailyRevenue: () => number;
  getDailyTransactions: () => Transaction[];
  getMonthlyRevenue: (month: number, year: number) => number;
  getMonthlyTransactions: (month: number, year: number) => Transaction[];
}

const PRODUCTS_KEY = "kasir_pos_products";
const TRANSACTIONS_KEY = "kasir_pos_transactions";

const defaultProducts: Product[] = [
  { id: "P001", name: "Kopi Hitam", price: 15000, stock: 20 },
  { id: "P002", name: "Kopi Susu", price: 18000, stock: 15 },
  { id: "P003", name: "Teh Manis", price: 10000, stock: 25 },
  { id: "P004", name: "Teh Tawar", price: 8000, stock: 25 },
  { id: "P005", name: "Air Mineral", price: 5000, stock: 30 },
  { id: "P006", name: "Jus Jeruk", price: 12000, stock: 12 },
  { id: "P007", name: "Nasi Goreng", price: 25000, stock: 10 },
  { id: "P008", name: "Mie Ayam", price: 20000, stock: 8 },
  { id: "P009", name: "Nasi Kucing", price: 8000, stock: 15 },
  { id: "P010", name: "Roti Bakar", price: 12000, stock: 6 },
  { id: "P011", name: "Kentang Goreng", price: 15000, stock: 3 },
  { id: "P012", name: "Sosis Goreng", price: 10000, stock: 0 },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return fallback;
}

function saveToStorage(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const initialProducts = useMemo(() => loadFromStorage<Product[]>(PRODUCTS_KEY, defaultProducts), []);
  const initialTransactions = useMemo(() => loadFromStorage<Transaction[]>(TRANSACTIONS_KEY, []), []);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const dup = products.some((p) => p.name.toLowerCase() === product.name.toLowerCase());
    if (dup) return { success: false, error: "Nama barang sudah ada di sistem" };
    if (product.price < 0 || product.stock < 0) return { success: false, error: "Harga dan stok tidak boleh bernilai negatif" };
    const id = `P${String(products.length + 1).padStart(3, "0")}`;
    const updated = [...products, { ...product, id }];
    setProducts(updated);
    saveToStorage(PRODUCTS_KEY, updated);
    return { success: true };
  }, [products]);

  const deductStock = useCallback((items: TransactionItem[]) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        const item = items.find((i) => i.productId === p.id);
        return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
      });
      saveToStorage(PRODUCTS_KEY, updated);
      return updated;
    });
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => {
      const updated = [...prev, transaction];
      saveToStorage(TRANSACTIONS_KEY, updated);
      return updated;
    });
  }, []);

  const getDailyRevenue = useCallback(() => {
    const today = new Date().toLocaleDateString("sv-SE");
    return transactions.filter((t) => t.date === today).reduce((s, t) => s + t.total, 0);
  }, [transactions]);

  const getDailyTransactions = useCallback(() => {
    const today = new Date().toLocaleDateString("sv-SE");
    return transactions.filter((t) => t.date === today);
  }, [transactions]);

  const getMonthlyRevenue = useCallback((month: number, year: number) => {
    return transactions.filter((t) => { const d = new Date(t.date); return d.getMonth() === month && d.getFullYear() === year; }).reduce((s, t) => s + t.total, 0);
  }, [transactions]);

  const getMonthlyTransactions = useCallback((month: number, year: number) => {
    return transactions.filter((t) => { const d = new Date(t.date); return d.getMonth() === month && d.getFullYear() === year; });
  }, [transactions]);

  const value = useMemo(() => ({
    products, transactions, addProduct, deductStock, addTransaction,
    getDailyRevenue, getDailyTransactions, getMonthlyRevenue, getMonthlyTransactions,
  }), [products, transactions, addProduct, deductStock, addTransaction, getDailyRevenue, getDailyTransactions, getMonthlyRevenue, getMonthlyTransactions]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
