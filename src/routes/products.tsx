import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, BottomNav, ProductCard } from "@/components/store";
import { categories, productsByCategory } from "@/data/products";

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): { cat: string; q: string } => ({
    cat: typeof s["cat"] === "string" ? (s["cat"] as string) : "all",
    q: typeof s["q"] === "string" ? (s["q"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "الأقسام وجميع المنتجات | AURAA" },
      { name: "description", content: "تصفح عطور AURAA حسب القسم: رجالية، نسائية، عربية، فاخرة، مجموعات وعروض خاصة." },
      { property: "og:title", content: "الأقسام وجميع المنتجات | AURAA" },
      { property: "og:description", content: "تصفح عطور AURAA حسب القسم: رجالية، نسائية، عربية، فاخرة، مجموعات وعروض خاصة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { cat, q } = Route.useSearch();
  const current = categories.find((c) => c.id === cat);
  const t = q.trim().toLowerCase();
  const list = productsByCategory(cat).filter((p) => !t || p.name.toLowerCase().includes(t));
  const tabs = [{ id: "all", label: "الكل", img: "" }, ...[...categories].reverse()];

  return (
    <div className="min-h-screen bg-background pb-20 font-sans md:pb-0">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <nav className="mb-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-gold">الرئيسية</Link> / <span>{current?.label ?? "جميع المنتجات"}</span>
        </nav>
        <h1 className="mb-6 flex items-center gap-3 text-2xl font-bold md:text-3xl">
          {current?.label ?? "جميع المنتجات"} <span className="h-0.5 w-10 bg-gold" />
        </h1>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <Link
              key={t.id}
              to="/products"
              search={{ cat: t.id, q }}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${cat === t.id ? "bg-gold text-gold-foreground" : "bg-muted hover:bg-border"}`}
            >
              {t.img && <img src={t.img} alt="" className="h-6 w-6 rounded-full object-cover" />}
              {t.label}
            </Link>
          ))}
        </div>

        <p className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
          {list.length} منتج
          {q && (
            <Link to="/products" search={{ cat, q: "" }} className="rounded-full bg-muted px-3 py-1 text-foreground hover:bg-border">
              نتائج البحث: "{q}" ✕
            </Link>
          )}
        </p>
        {list.length ? (
          <div key={cat} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {list.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <p className="py-20 text-center text-muted-foreground">لا توجد منتجات في هذا القسم.</p>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
