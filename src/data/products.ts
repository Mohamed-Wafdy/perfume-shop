import data from "./store.json";

// All store content lives in store.json. Images are referenced by filename in src/assets.
const assetFiles = import.meta.glob("../assets/*.{jpg,png,webp}", { eager: true, import: "default" }) as Record<string, string>;
export const asset = (file: string) => assetFiles[`../assets/${file}`] ?? "";

export type CategoryId = "men" | "women" | "sets" | "luxury" | "arabic" | "offers";

export type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  reviews: number;
  size: string;
  img: string;
  cats: CategoryId[];
  description: string;
  notes: string[];
  best?: boolean;
  isNew?: boolean;
};

export const store = data.store;
export const nav = data.nav as { label: string; cat?: string; home?: boolean }[];
export const slides = data.slides.map((s) => ({ ...s, img: asset(s.img) }));
export const promo = { ...data.promo, img: asset(data.promo.img) };
export const features = data.features;
export const brands = data.brands;
export const testimonials = data.testimonials;

export const categories = data.categories.map((c) => ({ ...c, id: c.id as CategoryId, img: asset(c.img) }));

export const products: Product[] = data.products.map((p) => ({
  ...p,
  cats: p.cats as CategoryId[],
  img: asset(p.img),
}));

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export function productsByCategory(cat?: string) {
  if (!cat || cat === "all") return products;
  return products.filter((p) => p.cats.includes(cat as CategoryId));
}
