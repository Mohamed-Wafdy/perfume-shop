import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, BadgeCheck, RefreshCcw, Star, Quote, Send } from "lucide-react";
import { SiteHeader, BottomNav, ProductCard } from "@/components/store";
import { categories, products, slides, promo, features, brands, testimonials, store } from "@/data/products";

const featureIcons = { truck: Truck, badge: BadgeCheck, shield: ShieldCheck, refresh: RefreshCcw } as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AURAA | متجر العطور الفاخرة" },
      { name: "description", content: "تسوّق أفضل العطور الرجالية والنسائية والعربية الأصلية من AURAA. وصل حديثاً، عروض خاصة، وأكثر ما يُباع في المتجر." },
      { property: "og:title", content: "AURAA | متجر العطور الفاخرة" },
      { property: "og:description", content: "تسوّق أفضل العطور الرجالية والنسائية والعربية الأصلية من AURAA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function SectionTitle({ title, cat }: { title: string; cat?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="flex items-center gap-3 text-xl font-bold md:text-2xl">
        {title} <span className="h-0.5 w-10 bg-gold" />
      </h2>
      <Link to="/products" search={{ cat: cat ?? "all", q: "" }} className="text-sm text-gold hover:underline">
        عرض الكل
      </Link>
    </div>
  );
}

function Index() {
  const [slide, setSlide] = useState(0);
  const go = (d: number) => setSlide((s) => (s + d + slides.length) % slides.length);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slide]);

  const newProducts = products.filter((p) => p.isNew);
  const offerProducts = products.filter((p) => p.oldPrice);

  return (
    <div className="min-h-screen bg-background pb-20 font-sans md:pb-0">
      <SiteHeader />
      <main className="mx-auto max-w-7xl">
        {/* Hero */}
        <section className="px-4 pt-4 md:px-0 md:pt-0">
          <div className="relative aspect-[3/1] overflow-hidden rounded-xl md:rounded-none" dir="ltr">
            <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${slide * 100}%)` }}>
              {slides.map((s, i) => (
                <img key={i} src={s.img} alt={s.alt} width={1920} height={640} className="h-full w-full shrink-0 object-cover" />
              ))}
            </div>
            <button aria-label="السابق" onClick={() => go(-1)} className="absolute top-1/2 left-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow md:left-6">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button aria-label="التالي" onClick={() => go(1)} className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow md:right-6">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((_, d) => (
                <button key={d} aria-label={`شريحة ${d + 1}`} onClick={() => setSlide(d)} className={`h-2 rounded-full transition-all ${d === slide ? "w-6 bg-background" : "w-2 bg-background/60"}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="grid grid-cols-3 gap-4 px-4 py-6 sm:grid-cols-6 md:px-6 md:py-8">
          {categories.map((c) => (
            <Link key={c.id} to="/products" search={{ cat: c.id, q: "" }} className="group flex flex-col items-center gap-2 md:gap-3">
              <img src={c.img} alt={c.label} className="h-16 w-16 rounded-full object-cover transition-transform group-hover:scale-110 md:h-20 md:w-20 lg:h-24 lg:w-24" />
              <span className="text-xs font-bold md:text-sm">{c.label}</span>
            </Link>
          ))}
        </section>

        {/* New arrivals */}
        <section className="px-4 pb-12 md:px-8">
          <SectionTitle title="وصل حديثاً" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {newProducts.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* Promo banner */}
        <section className="px-4 pb-12 md:px-8">
          <div className="relative overflow-hidden rounded-xl">
            <img src={promo.img} alt={promo.title} width={1920} height={640} loading="lazy" className="h-48 w-full object-cover md:h-64" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-foreground/50 p-6 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-gold md:text-sm">{promo.tag}</span>
              <h2 className="text-2xl font-bold text-background md:text-4xl">{promo.title}</h2>
              <p className="text-sm text-background/90 md:text-base">{promo.text}</p>
              <Link to="/products" search={{ cat: promo.cat, q: "" }} className="mt-2 rounded-full bg-gold px-8 py-3 text-sm font-bold text-gold-foreground transition-opacity hover:opacity-90 md:text-base">
                {promo.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* Special offers */}
        <section className="px-4 pb-12 md:px-8">
          <SectionTitle title="عروض خاصة" cat="offers" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {offerProducts.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* Best sellers */}
        <section className="px-4 pb-12 md:px-8">
          <SectionTitle title="الأكثر مبيعاً" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {products.filter((p) => p.best).map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-2 gap-4 px-4 pb-12 md:grid-cols-4 md:px-8">
          {features.map((f) => {
            const Icon = featureIcons[f.icon as keyof typeof featureIcons];
            return (
            <div key={f.title} className="flex flex-col items-center gap-2 rounded-xl border border-border p-5 text-center md:flex-row md:items-center md:p-6 md:text-right">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">{f.text}</p>
              </div>
            </div>
          );})}
        </section>

        {/* Brands */}
        <section className="pb-12 md:px-8">
          <SectionTitle title="أشهر الماركات" />
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {brands.map((b) => (
              <Link key={b} to="/products" search={{ cat: "all", q: b }} dir="ltr" className="rounded-full border border-border px-6 py-3 text-sm font-bold tracking-wide transition-colors hover:border-gold hover:text-gold md:text-base">
                {b}
              </Link>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted px-4 py-12 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center text-xl font-bold md:text-2xl">آراء عملائنا</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.name} className="rounded-xl bg-background p-6 shadow-sm">
                  <Quote className="h-6 w-6 text-gold" />
                  <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{t.text}</blockquote>
                  <div className="mt-4 flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-star text-star" />)}
                  </div>
                  <figcaption className="mt-2 font-bold">
                    {t.name} <span className="text-xs font-normal text-muted-foreground">— {t.city}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="px-4 py-12 md:px-8">
          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-muted/50 p-8 text-center">
            <h2 className="text-xl font-bold md:text-2xl">اشترك في نشرتنا البريدية</h2>
            <p className="mt-2 text-sm text-muted-foreground">كن أول من يعرف عن العطور الجديدة والعروض الحصرية</p>
            <form
              className="mx-auto mt-5 flex max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const input = (e.currentTarget.elements.namedItem("email") as HTMLInputElement);
                input.value = "";
                input.placeholder = "تم الاشتراك بنجاح ✓";
                setTimeout(() => (input.placeholder = "بريدك الإلكتروني"), 3000);
              }}
            >
              <input
                name="email"
                type="email"
                required
                placeholder="بريدك الإلكتروني"
                className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-gold"
              />
              <button type="submit" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold text-gold-foreground transition-opacity hover:opacity-90" aria-label="اشترك">
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted px-4 py-10 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold tracking-widest" dir="ltr">{store.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{store.about}</p>
          </div>
          <nav className="text-sm">
            <h4 className="mb-3 font-bold">الأقسام</h4>
            <ul className="space-y-2 text-muted-foreground">
              {categories.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <Link to="/products" search={{ cat: c.id, q: "" }} className="hover:text-gold">{c.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="text-sm">
            <h4 className="mb-3 font-bold">روابط سريعة</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/" className="hover:text-gold">الرئيسية</Link></li>
              <li><Link to="/products" search={{ cat: "all", q: "" }} className="hover:text-gold">جميع المنتجات</Link></li>
              <li><Link to="/products" search={{ cat: "offers", q: "" }} className="hover:text-gold">عروض خاصة</Link></li>
            </ul>
          </nav>
          <div className="text-sm">
            <h4 className="mb-3 font-bold">تواصل معنا</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li dir="ltr">{store.phone}</li>
              <li dir="ltr">{store.email}</li>
              <li>{store.hours}</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">{store.copyright}</p>
      </footer>

      <BottomNav />
    </div>
  );
}
