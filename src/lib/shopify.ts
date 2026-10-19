import { queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "4uvgaa-qr.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "33a4cea3feb67091453e3efc485cb80f";

export interface ShopifyVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  image: { url: string; altText: string | null } | null;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    vendor: string;
    productType: string;
    tags: string[];
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: { edges: Array<{ node: ShopifyVariant }> };
    options: Array<{ name: string; values: string[] }>;
  };
}

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          vendor
          productType
          tags
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 5) { edges { node { url altText } } }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                availableForSale
                selectedOptions { name value }
                image { url altText }
              }
            }
          }
          options { name values }
        }
      }
    }
  }
`;

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description:
        "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return;
  }

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  }
  return data;
}

/** UI-facing product shape derived from Shopify data. Nothing is hardcoded. */
export type UiProduct = {
  raw: ShopifyProduct;
  id: string;
  handle: string;
  title: string;
  description: string;
  short: string;
  image: string | null;
  images: Array<{ url: string; altText: string | null }>;
  vendor: string;
  vendorSlug: string;
  category: string;
  categories: string[];
  tags: string[];
  price: number;
  currencyCode: string;
  inStock: boolean;
  variants: ShopifyVariant[];
  options: Array<{ name: string; values: string[] }>;
  isNew: boolean;
  bestSeller: boolean;
  featured: boolean;
  minAge: number;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hasTag(tags: string[], name: string) {
  return tags.some((t) => slugify(t) === name);
}

/** Boutique shelf names: normalize raw Shopify product types. */
function normalizeCategory(raw: string): string {
  const key = slugify(raw || "baby-essentials");
  if (key === "book") return "Books";
  if (key === "clothes" || key === "clothing") return "Clothes";
  if (!raw) return "Baby Essentials";
  return raw;
}

function deriveProductCategories(n: ShopifyProduct["node"]): string[] {
  const haystack = `${n.title} ${n.productType} ${(n.tags ?? []).join(" ")}`.toLowerCase();
  const cats = new Set<string>();

  if (haystack.includes("cardigan") || haystack.includes("clothes") || haystack.includes("clothing")) {
    cats.add("Clothes");
  } else {
    cats.add(normalizeCategory(n.productType));
  }

  if (haystack.includes("feeding")) {
    cats.add("Feeding Sets");
    cats.add("Baby Essentials");
  }

  return Array.from(cats);
}

function toUiProduct(edge: ShopifyProduct): UiProduct {
  const n = edge.node;
  const variants = (n.variants?.edges ?? []).map((v) => v.node);
  const images = (n.images?.edges ?? []).map((i) => i.node);
  const tags = n.tags ?? [];
  const description = n.description ?? "";
  const categories = deriveProductCategories(n);

  return {
    raw: edge,
    id: n.id,
    handle: n.handle,
    title: n.title,
    description,
    short: description.length > 120 ? `${description.slice(0, 117).trimEnd()}…` : description,
    image: images[0]?.url ?? null,
    images,
    vendor: n.vendor || "Linamii",
    vendorSlug: slugify(n.vendor || "Linamii"),
    category: categories[0] ?? "Baby Essentials",
    categories,
    tags,
    price: Number(n.priceRange.minVariantPrice.amount),
    currencyCode: n.priceRange.minVariantPrice.currencyCode,
    inStock: variants.some((v) => v.availableForSale),
    variants,
    options: n.options ?? [],
    isNew: hasTag(tags, "new") || hasTag(tags, "new-arrival"),
    bestSeller: hasTag(tags, "best-seller") || hasTag(tags, "bestseller"),
    featured: hasTag(tags, "featured"),
    minAge:
      hasTag(tags, "3-6-years") || hasTag(tags, "3-6") || hasTag(tags, "36-72-months")
        ? 36
        : hasTag(tags, "6-12-months") || hasTag(tags, "6-12")
          ? 6
          : 0,
  };
}

export async function fetchProducts(first = 100): Promise<UiProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first });
  const edges: ShopifyProduct[] = data?.data?.products?.edges ?? [];
  return edges.map(toUiProduct);
}

export const productsQueryOptions = queryOptions({
  queryKey: ["shopify", "products"],
  queryFn: () => fetchProducts(100),
  staleTime: 1000 * 60 * 5,
});

/** Brand kinds are derived: our own vendor is the signature collection. */
export type BrandKind = "signature" | "partner" | "local-maker";

export type Brand = {
  slug: string;
  name: string;
  kind: BrandKind;
  image: string | null;
  count: number;
  categories: string[];
};

const SIGNATURE_VENDOR = "linamii";

export function deriveBrands(products: UiProduct[]): Brand[] {
  const map = new Map<string, Brand>();
  for (const p of products) {
    const existing = map.get(p.vendorSlug);
    if (existing) {
      existing.count += 1;
      if (!existing.image) existing.image = p.image;
      for (const c of p.categories ?? []) {
        if (!existing.categories.includes(c)) existing.categories.push(c);
      }
      continue;
    }
    map.set(p.vendorSlug, {
      slug: p.vendorSlug,
      name: p.vendor,
      kind: p.vendorSlug === SIGNATURE_VENDOR ? "signature" : p.tags.some((t) => slugify(t) === "local-maker") ? "local-maker" : "partner",
      image: p.image,
      count: 1,
      categories: [...(p.categories ?? [])],
    });
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/** Boutique aisles that always appear, even before stock is loaded for them. */
export const BASE_CATEGORIES = [
  "Clothes",
  "Feeding Sets",
  "Blankets",
  "Toys",
  "Bath & Care",
  "Nursery",
  "Gift Sets",
];

export function deriveCategories(products: UiProduct[]): string[] {
  const fromStore = products.flatMap((p) => p.categories ?? []).filter(Boolean);
  return Array.from(new Set([...BASE_CATEGORIES, ...fromStore])).sort();
}

export function formatMoney(amount: number, currencyCode = "ZAR") {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}
