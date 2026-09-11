const API_VERSION = "2025-10";

export type ShopifyVariant = {
  id: string;
  title?: string;
  available: boolean;
  price: string;
  currency: string;
};

export type ShopifyImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  category: string;
  image?: ShopifyImage;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
};

type CartLine = {
  variantId: string;
  quantity: number;
};

function storeHost() {
  return (process.env.SHOPIFY_STORE_DOMAIN ?? "")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

function accessToken() {
  return (process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ?? "").trim();
}

function formatMoney(amount: string | number, currency = "USD") {
  const value = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(value)) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

function numericId(gid: string) {
  const match = String(gid).match(/(\d+)\s*$/);
  return match?.[1] ?? gid;
}

function absoluteUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

function categoryFromTitle(title: string, productType?: string) {
  if (productType) return productType;
  const name = title.toLowerCase();
  if (name.includes("snapback") || name.includes("hat")) return "Hats";
  if (name.includes("youth")) return "Youth";
  if (name.includes("hoodie") || name.includes("zip")) return "Outerwear";
  return "Tops";
}

type RawNode = Record<string, unknown>;

function asNodes(value: unknown): RawNode[] {
  if (!value || typeof value !== "object") return [];
  const record = value as { nodes?: unknown; edges?: { node?: unknown }[] };
  if (Array.isArray(record.nodes)) {
    return record.nodes.filter((node): node is RawNode => Boolean(node) && typeof node === "object");
  }
  if (Array.isArray(record.edges)) {
    return record.edges
      .map((edge) => edge.node)
      .filter((node): node is RawNode => Boolean(node) && typeof node === "object");
  }
  return [];
}

function moneyFromUnknown(value: unknown): { amount: string; currency: string } | null {
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number") {
    return { amount: String(value), currency: "USD" };
  }
  if (typeof value === "object") {
    const record = value as { amount?: unknown; currencyCode?: unknown; currency?: unknown };
    if (record.amount != null) {
      return {
        amount: String(record.amount),
        currency: String(record.currencyCode || record.currency || "USD"),
      };
    }
  }
  return null;
}

async function shopifyFetch(
  endpoint: string,
  headers: Record<string, string>,
  query: string,
  variables?: Record<string, unknown>,
  cache: RequestCache = "force-cache",
) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    next: cache === "force-cache" ? { revalidate: 60 } : undefined,
  });

  const json = (await res.json().catch(() => null)) as {
    data?: Record<string, unknown>;
    errors?: { message?: string }[];
  } | null;

  if (!res.ok) {
    throw new Error(`Shopify ${res.status}`);
  }

  return json;
}

function mapGraphqlProduct(node: RawNode): ShopifyProduct | null {
  const variants = asNodes(node.variants)
    .map((variant) => {
      const money = moneyFromUnknown(variant.price);
      if (!money || !variant.id) return null;
      const title = String(variant.title || "");
      return {
        id: String(variant.id),
        title: title && title !== "Default Title" ? title : undefined,
        available: variant.availableForSale !== false,
        price: formatMoney(money.amount, money.currency),
        currency: money.currency,
      } satisfies ShopifyVariant;
    })
    .filter(Boolean) as ShopifyVariant[];

  if (variants.length === 0) return null;

  const imageNode = node.featuredImage as
    | { url?: string; altText?: string; width?: number; height?: number }
    | undefined;
  const title = String(node.title || "Untitled");
  const image = imageNode?.url
    ? {
        url: absoluteUrl(imageNode.url),
        alt: imageNode.altText || title,
        width: imageNode.width || 800,
        height: imageNode.height || 800,
      }
    : undefined;

  return {
    id: String(node.id || node.handle || title),
    handle: String(node.handle || ""),
    title,
    category: categoryFromTitle(title, String(node.productType || "")),
    image,
    images: image ? [image] : [],
    variants,
  };
}

async function fetchCatalogJson() {
  const host = storeHost();
  if (!host) return [];

  const products: ShopifyProduct[] = [];
  for (let page = 1; page <= 10; page += 1) {
    const res = await fetch(`https://${host}/products.json?limit=250&page=${page}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) break;
    const json = (await res.json()) as {
      products?: {
        id?: number | string;
        title?: string;
        handle?: string;
        product_type?: string;
        images?: { src?: string; width?: number; height?: number; alt?: string }[];
        variants?: {
          id?: number | string;
          title?: string;
          available?: boolean;
          price?: string;
        }[];
      }[];
    };
    const batch = json.products ?? [];
    for (const product of batch) {
      const title = product.title || "Untitled";
      const variants = (product.variants ?? [])
        .map((variant) => {
          if (variant.id == null || variant.price == null) return null;
          const variantTitle = String(variant.title || "");
          return {
            id: String(variant.id),
            title: variantTitle && variantTitle !== "Default Title" ? variantTitle : undefined,
            available: variant.available !== false,
            price: formatMoney(variant.price),
            currency: "USD",
          } satisfies ShopifyVariant;
        })
        .filter(Boolean) as ShopifyVariant[];
      if (variants.length === 0) continue;
      const images = (product.images ?? [])
        .filter((image) => image.src)
        .map((image) => ({
          url: absoluteUrl(image.src),
          alt: image.alt || title,
          width: image.width || 800,
          height: image.height || 800,
        }));
      products.push({
        id: String(product.id || product.handle || title),
        handle: product.handle || "",
        title,
        category: categoryFromTitle(title, product.product_type),
        image: images[0],
        images,
        variants,
      });
    }
    if (batch.length < 250) break;
  }

  return products;
}

const STOREFRONT_PRODUCTS = /* GraphQL */ `
  query ShopProducts {
    products(first: 50, sortKey: TITLE) {
      nodes {
        id
        handle
        title
        productType
        featuredImage { url altText width height }
        variants(first: 50) {
          nodes {
            id
            title
            availableForSale
            price { amount currencyCode }
          }
        }
      }
    }
  }
`;

async function fetchStorefrontProducts() {
  const json = await shopifyFetch(
    `https://${storeHost()}/api/${API_VERSION}/graphql.json`,
    {
      "Shopify-Storefront-Private-Token": accessToken(),
      "X-Shopify-Storefront-Access-Token": accessToken(),
    },
    STOREFRONT_PRODUCTS,
  );
  return asNodes(json?.data?.products).map(mapGraphqlProduct).filter(Boolean) as ShopifyProduct[];
}

export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  if (!storeHost()) return [];

  try {
    const catalog = await fetchCatalogJson();
    if (catalog.length > 0) return catalog;
  } catch {
    // Fall through to Storefront GraphQL if the public catalog is blocked.
  }

  if (!accessToken()) return [];

  try {
    return await fetchStorefrontProducts();
  } catch {
    return [];
  }
}

function cartPermalink(lines: CartLine[]) {
  const path = lines
    .filter((line) => line.quantity > 0)
    .map((line) => `${numericId(line.variantId)}:${line.quantity}`)
    .join(",");
  return `https://${storeHost()}/cart/${path}`;
}

export async function createShopifyCheckout(lines: CartLine[]) {
  const usable = lines.filter((line) => line.quantity > 0 && line.variantId);
  if (usable.length === 0) {
    throw new Error("Cart is empty.");
  }
  return cartPermalink(usable);
}

export function shopifyStoreUrl() {
  const publicUrl = (process.env.NEXT_PUBLIC_SHOPIFY_URL ?? "").trim();
  if (publicUrl) return publicUrl;
  const host = storeHost();
  return host ? `https://${host}` : "";
}
