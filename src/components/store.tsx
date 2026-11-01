import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Heart, User, ShoppingBag, ShoppingCart, Menu, Star, Home, LayoutGrid, X, Plus, Minus, Trash2 } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { products, nav, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export function searchProducts(q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return products;
  return products.filter((p) => p.name.toLowerCase().includes(t));
}

function SearchBox({ className }: { className: string }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const results = q.trim() ? searchProducts(q).slice(0, 5) : [];
  const submit = () => {
    setFocus(false);
    navigate({ to: "/products", search: { cat: "all", q: q.trim() } });
  };
  return (
    <form
      className={`relative ${className}`}
      onSubmit={(e) => { e.preventDefault(); submit(); }}
    >
      <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
        <button type="submit" aria-label="بحث"><Search className="h-4 w-4" /></button>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          placeholder="ابحث عن منتجك المفضل ..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
      {focus && q.trim() && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          {results.length ? results.map((p) => (
            <button key={p.id} type="button" onMouseDown={() => { setQ(p.name); navigate({ to: "/products", search: { cat: "all", q: p.name } }); }}
              className="flex w-full items-center gap-3 px-3 py-2 text-right hover:bg-muted">
              <img src={p.img} alt="" className="h-10 w-10 rounded object-cover" />
              <span className="flex-1 truncate text-sm" dir="ltr">{p.name}</span>
              <span className="text-xs font-bold">{p.price} ر.س</span>
            </button>
          )) : <p className="p-3 text-sm text-muted-foreground">لا توجد نتائج</p>}
        </div>
      )}
    </form>
  );
}

function WishlistButton({ className }: { className?: string }) {
  const { count, setOpen } = useWishlist();
  return (
    <button className={`relative ${className ?? ""}`} aria-label="المفضلة" onClick={() => setOpen(true)}>
      <Heart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-2 -left-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] text-gold-foreground">{count}</span>
      )}
    </button>
  );
}

export function WishlistDrawer() {
  const { items, open, setOpen, remove } = useWishlist();
  const { add } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-foreground/40 animate-in fade-in" onClick={() => setOpen(false)} />
      <aside className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-background shadow-xl animate-in slide-in-from-left duration-300">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold">المفضلة</h2>
          <button aria-label="إغلاق" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {items.length === 0 && <p className="py-20 text-center text-muted-foreground">لا توجد منتجات في المفضلة بعد</p>}
          {items.map((p) => (
            <div key={p.id} className="flex gap-3">
              <img src={p.img} alt={p.name} className="h-20 w-20 rounded-lg object-cover" />
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium" dir="ltr">{p.name}</p>
                  <button aria-label="حذف" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{p.price} ر.س</span>
                  <button
                    onClick={() => { add(p.id); remove(p.id); }}
                    className="flex items-center gap-1 rounded-md bg-gold px-3 py-1.5 text-xs font-bold text-gold-foreground hover:opacity-90"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> أضف للسلة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button className="relative" aria-label="السلة" onClick={() => setOpen(true)}>
      <ShoppingBag className="h-6 w-6" />
      <span className="absolute -top-2 -left-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] text-gold-foreground">{count}</span>
    </button>
  );
}

const WHATSAPP_NUMBER = "201025532830";

function whatsappOrderUrl(lines: { product: { name: string; price: number }; qty: number }[], total: number) {
  const items = lines.map(({ product: p, qty }) => `• ${p.name} × ${qty} = ${p.price * qty} ر.س`).join("\n");
  const message = `مرحباً، أريد إتمام طلبي من متجر AURAA:\n\n${items}\n\nالإجمالي: ${total} ر.س`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function CartDrawer() {
  const { lines, total, open, setOpen, setQty, remove } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-foreground/40 animate-in fade-in" onClick={() => setOpen(false)} />
      <aside className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-background shadow-xl animate-in slide-in-from-left duration-300">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold">سلة التسوق</h2>
          <button aria-label="إغلاق" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {lines.length === 0 && <p className="py-20 text-center text-muted-foreground">السلة فارغة</p>}
          {lines.map(({ product: p, qty }) => (
            <div key={p.id} className="flex gap-3">
              <img src={p.img} alt={p.name} className="h-20 w-20 rounded-lg object-cover" />
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium" dir="ltr">{p.name}</p>
                  <button aria-label="حذف" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                    <button aria-label="زيادة" onClick={() => setQty(p.id, qty + 1)}><Plus className="h-3 w-3" /></button>
                    <span className="w-5 text-center text-sm">{qty}</span>
                    <button aria-label="تقليل" onClick={() => setQty(p.id, qty - 1)}><Minus className="h-3 w-3" /></button>
                  </div>
                  <span className="text-sm font-bold">{p.price * qty} ر.س</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div className="space-y-3 border-t border-border p-4">
            <div className="flex justify-between font-bold"><span>الإجمالي</span><span>{total} ر.س</span></div>
            <a
              href={whatsappOrderUrl(lines, total)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-md bg-gold py-3 text-center font-bold text-gold-foreground hover:opacity-90"
            >
              إتمام الشراء عبر واتساب
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}


function useActive() {
  const loc = useRouterState({ select: (s) => s.location });
  const cat = (loc.search as { cat?: string }).cat ?? "all";
  return { path: loc.pathname, cat };
}

function NavLink({ item, onClick }: { item: (typeof nav)[number]; onClick?: () => void }) {
  const { path, cat } = useActive();
  const active = item.home ? path === "/" : path === "/products" && cat === item.cat;
  const cls = active ? "border-b-2 border-gold pb-1 text-gold" : "pb-1 hover:text-gold";
  return item.home ? (
    <Link to="/" className={cls} onClick={onClick}>{item.label}</Link>
  ) : (
    <Link to="/products" search={{ cat: item.cat ?? "all", q: "" }} className={cls} onClick={onClick}>{item.label}</Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:gap-8">
        <button className="lg:hidden" aria-label="القائمة" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link to="/" className="mx-auto shrink-0 lg:mx-0">
          <img src={logo} alt="AURAA" className="h-12 w-auto mix-blend-multiply" />
        </Link>
        <nav className="hidden flex-1 items-center gap-6 text-sm font-medium lg:flex">
          {nav.map((n) => <NavLink key={n.label} item={n} />)}
        </nav>
        <SearchBox className="hidden w-64 md:block" />
        <div className="flex items-center gap-4">
          <User className="hidden h-6 w-6 md:block" />
          <WishlistButton />
          <CartButton />
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-border px-6 py-4 text-sm font-medium lg:hidden">
          {nav.map((n) => <NavLink key={n.label} item={n} onClick={() => setOpen(false)} />)}
        </nav>
      )}
      <div className="px-4 pb-3 md:hidden">
        <SearchBox className="w-full" />
      </div>
      <CartDrawer />
      <WishlistDrawer />
    </header>
  );
}

export function BottomNav() {
  const { path } = useActive();
  const { setOpen } = useWishlist();
  const cls = (a: boolean) => `flex flex-col items-center gap-1 text-xs ${a ? "text-gold" : ""}`;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background py-2 md:hidden">
      <Link to="/" className={cls(path === "/")}><Home className="h-5 w-5" />الرئيسية</Link>
      <button className={cls(false)} onClick={() => setOpen(true)}><Heart className="h-5 w-5" />المفضلة</button>
      <Link to="/products" search={{ cat: "all", q: "" }} className={cls(path === "/products")}><LayoutGrid className="h-5 w-5" />الأقسام</Link>
      <a href="#" className={cls(false)}><User className="h-5 w-5" />حسابي</a>
    </nav>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const fav = has(p.id);
  return (
    <article className="group animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-lg bg-muted">
        <Link to="/products/$slug" params={{ slug: p.slug }}><img src={p.img} alt={p.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" /></Link>
        <button
          aria-label={fav ? "إزالة من المفضلة" : "أضف إلى المفضلة"}
          aria-pressed={fav}
          onClick={() => toggle(p.id)}
          className="absolute top-2 left-2 grid h-10 w-10 place-items-center rounded-full bg-background transition-transform active:scale-90"
        >
          <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-star text-star" : ""}`} />
        </button>
        {p.oldPrice && (
          <span className="absolute top-2 right-2 rounded-full bg-gold px-2 py-0.5 text-xs text-gold-foreground">
            خصم {Math.round((1 - p.price / p.oldPrice) * 100)}%
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between gap-2" dir="ltr">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium"><Link to="/products/$slug" params={{ slug: p.slug }} className="hover:text-gold">{p.name}</Link></h3>
          <p className="mt-1 flex items-baseline gap-2" dir="rtl">
            <span className="text-lg font-bold">{p.price} ر.س</span>
            {p.oldPrice && <span className="text-xs text-muted-foreground line-through">{p.oldPrice}</span>}
          </p>
          <div className="mt-1 flex items-center gap-0.5 text-xs text-muted-foreground">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-star text-star" />)}
            <span className="ml-1">({p.reviews})</span>
          </div>
        </div>
        <button aria-label="أضف للسلة" onClick={() => add(p.id)} className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gold text-gold-foreground hover:opacity-90">
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
