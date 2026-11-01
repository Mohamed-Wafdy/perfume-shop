import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { products, type Product } from "@/data/products";

type Line = { id: number; qty: number };
type Ctx = {
  lines: (Line & { product: Product })[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "auraa-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const lines = items
    .map((l) => ({ ...l, product: products.find((p) => p.id === l.id)! }))
    .filter((l) => l.product);

  const value: Ctx = {
    lines,
    count: lines.reduce((s, l) => s + l.qty, 0),
    total: lines.reduce((s, l) => s + l.qty * l.product.price, 0),
    open,
    setOpen,
    add: (id) => {
      setItems((cur) => {
        const f = cur.find((l) => l.id === id);
        return f ? cur.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...cur, { id, qty: 1 }];
      });
      setOpen(true);
    },
    setQty: (id, qty) =>
      setItems((cur) => (qty <= 0 ? cur.filter((l) => l.id !== id) : cur.map((l) => (l.id === id ? { ...l, qty } : l)))),
    remove: (id) => setItems((cur) => cur.filter((l) => l.id !== id)),
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
