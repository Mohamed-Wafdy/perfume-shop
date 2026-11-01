import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, ShoppingCart, Star, Minus, Plus, ChevronLeft } from "lucide-react";
import { SiteHeader, BottomNav, ProductCard } from "@/components/store";
import { getProduct, products, categories, store } from "@/data/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/products_/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} | ${store.name}` : `غير متوفر | ${store.name}`;
    const desc = p?.description ?? "المنتج غير متوفر";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-8 text-center">
      <div>
        <p className="text-lg font-bold">المنتج غير موجود</p>
        <Link to="/products" search={{ cat: "all", q: "" }} className="mt-4 inline-block text-gold hover:underline">تصفح جميع المنتجات</Link>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const { add, setQty: setCartQty, lines } = useCart();
  const { has, toggle } = useWishlist();
  const fav = has(p.id);
  const related = products.filter((r) => r.id !== p.id && r.cats.some((c) => p.cats.includes(c))).slice(0, 4);
  const cat = categories.find((c) => p.cats.includes(c.id));

  const addToCart = () => {
    const current = lines.find((l) => l.product.id === p.id)?.qty ?? 0;
    if (current === 0) add(p.id);
    setCartQty(p.id, current + qty);
  };

  return (
    <div className="min-h-screen bg-background pb-20 font-sans md:pb-0">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-gold">الرئيسية</Link>
          <ChevronLeft className="h-4 w-4" />
          {cat && (<><Link to="/products" search={{ cat: cat.id, q: "" }} className="hover:text-gold">{cat.label}</Link><ChevronLeft className="h-4 w-4" /></>)}
          <span className="text-foreground" dir="ltr">{p.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="overflow-hidden rounded-xl bg-muted">
            <img src={p.img} alt={p.name} className="aspect-square w-full object-cover" />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-sm font-bold tracking-widest text-gold" dir="ltr">{p.brand}</span>
            <h1 className="text-2xl font-bold md:text-4xl" dir="ltr">{p.name}</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-star text-star" />)}
              <span className="mr-2">({p.reviews} تقييم)</span>
            </div>
            <p className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{p.price} {store.currency}</span>
              {p.oldPrice && <span className="text-muted-foreground line-through">{p.oldPrice} {store.currency}</span>}
              {p.oldPrice && <span className="rounded-full bg-gold px-2 py-0.5 text-xs text-gold-foreground">خصم {Math.round((1 - p.price / p.oldPrice) * 100)}%</span>}
            </p>
            <p className="leading-relaxed text-muted-foreground">{p.description}</p>
            <div>
              <h2 className="mb-2 font-bold">المكونات العطرية</h2>
              <div className="flex flex-wrap gap-2">
                {p.notes.map((n) => <span key={n} className="rounded-full border border-border px-3 py-1 text-sm">{n}</span>)}
              </div>
            </div>
            <p className="text-sm"><span className="font-bold">الحجم:</span> {p.size}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 rounded-full border border-border px-4 py-2">
                <button aria-label="زيادة" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></button>
                <span className="w-6 text-center font-bold">{qty}</span>
                <button aria-label="تقليل" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></button>
              </div>
              <button onClick={addToCart} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-gold-foreground hover:opacity-90">
                <ShoppingCart className="h-5 w-5" /> أضف للسلة
              </button>
              <button aria-label="المفضلة" aria-pressed={fav} onClick={() => toggle(p.id)} className="grid h-12 w-12 place-items-center rounded-full border border-border">
                <Heart className={`h-5 w-5 ${fav ? "fill-star text-star" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-xl font-bold md:text-2xl">منتجات مشابهة</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {related.map((r) => <ProductCard key={r.id} p={r} />)}
            </div>
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
