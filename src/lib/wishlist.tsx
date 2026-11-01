import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { products, type Product } from "@/data/products";

type Ctx = {
  items: Product[];
  count: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  has: (id: number) => boolean;
  toggle: (id: number) => void;
  remove: (id: number) => void;
};

const WishlistCtx = createContext<Ctx | null>(null);
const KEY = "auraa-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const value: Ctx = {
    items,
    count: items.length,
    open,
    setOpen,
    has: (id) => ids.includes(id),
    toggle: (id) =>
      setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])),
    remove: (id) => setIds((cur) => cur.filter((x) => x !== id)),
  };

  return <WishlistCtx.Provider value={value}>{children}</WishlistCtx.Provider>;
}

export function useWishlist() {
  const c = useContext(WishlistCtx);
  if (!c) throw new Error("useWishlist outside WishlistProvider");
  return c;
}
