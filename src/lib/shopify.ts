const API_VERSION = "2025-10";

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  category: string;
  available: boolean;
  image?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  price: string;
  currency: string;
  variantId: string;
  variantTitle?: string;
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

function shopConfigured() {
  return Boolean(storeHost() && accessToken());
}

function formatMoney(amount: string | number, currency: string) {
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
  const match = gid.match(/(\d+)\s*$/);
  return match?.[1] ?? gid;
}

function variantIdFromUnknown(value: unknown) {
  return typeof value === "string" ? value : "";
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

const STOREFRONT_PRODUCTS = /* GraphQL */ `
  query ShopProducts {
    products(first: 50, sortKey: TITLE) {
      nodes {
        id
        handle
        title
        productType
        tags
        availableForSale
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 20) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

const ADMIN_PRODUCTS = /* GraphQL */ `
  query ShopProducts {
    products(first: 50) {
      nodes {
        id
        handle
        title
        productType
        tags
        featuredImage {
          url
          altText
          width
          height
        }
        variants(first: 20) {
          nodes {
            id
            title
            availableForSale
            price
          }
        }
      }
    }
  }
`;

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

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

function mapProduct(node: RawNode): ShopifyProduct | null {
  const variants = asNodes(node.variants);
  const variant =
    variants.find((item) => item.availableForSale !== false) ?? variants[0];
  if (!variant) return null;

  const priceRange = node.priceRange as
    | { minVariantPrice?: unknown }
    | undefined;
  const money =
    moneyFromUnknown(variant.price) ??
    moneyFromUnknown(priceRange?.minVariantPrice);
  if (!money) return null;

  const imageNode = (node.featuredImage || variant.image) as
    | { url?: string; altText?: string; width?: number; height?: number }
    | undefined;
  const productType = String(node.productType || "");
  const tags = Array.isArray(node.tags) ? node.tags.map(String) : [];
  const variantTitle = String(variant.title || "");

  return {
    id: String(node.id || ""),
    handle: String(node.handle || ""),
    title: String(node.title || "Untitled"),
    category: productType || tags[0] || "Gear",
    available: Boolean(
      node.availableForSale !== false && variant.availableForSale !== false,
    ),
    image: imageNode?.url
      ? {
          url: imageNode.url,
          alt: imageNode.altText || String(node.title || "Product"),
          width: imageNode.width || 800,
          height: imageNode.height || 800,
        }
      : undefined,
    price: formatMoney(money.amount, money.currency),
    currency: money.currency,
    variantId: variantIdFromUnknown(variant.id),
    variantTitle:
      variantTitle && variantTitle !== "Default Title" ? variantTitle : undefined,
  };
}

async function fetchStorefrontProducts() {
  const json = await shopifyFetch(
    `https://${storeHost()}/api/${API_VERSION}/graphql.json`,
    {
      "Shopify-Storefront-Private-Token": accessToken(),
      "X-Shopify-Storefront-Access-Token": accessToken(),
    },
    STOREFRONT_PRODUCTS,
  );
  const products = json?.data?.products;
  return asNodes(products).map(mapProduct).filter(Boolean) as ShopifyProduct[];
}

async function fetchAdminProducts() {
  const json = await shopifyFetch(
    `https://${storeHost()}/admin/api/${API_VERSION}/graphql.json`,
    { "X-Shopify-Access-Token": accessToken() },
    ADMIN_PRODUCTS,
  );
  const products = json?.data?.products;
  return asNodes(products).map(mapProduct).filter(Boolean) as ShopifyProduct[];
}

export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  if (!shopConfigured()) return [];

  try {
    const products = await fetchStorefrontProducts();
    if (products.length > 0) return products;
  } catch {
    // Fall through to Admin if this token is an admin token.
  }

  try {
    return await fetchAdminProducts();
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
  const usable = lines.filter(
    (line) =>
      line.quantity > 0 &&
      (line.variantId.startsWith("gid://shopify/ProductVariant/") ||
        /^\d+$/.test(line.variantId)),
  );
  if (usable.length === 0) {
    throw new Error("Cart is empty.");
  }

  try {
    const json = await shopifyFetch(
      `https://${storeHost()}/api/${API_VERSION}/graphql.json`,
      {
        "Shopify-Storefront-Private-Token": accessToken(),
        "X-Shopify-Storefront-Access-Token": accessToken(),
      },
      CART_CREATE,
      {
        lines: usable.map((line) => ({
          merchandiseId: line.variantId.startsWith("gid://")
            ? line.variantId
            : `gid://shopify/ProductVariant/${line.variantId}`,
          quantity: line.quantity,
        })),
      },
      "no-store",
    );
    const payload = json?.data?.cartCreate as
      | {
          cart?: { checkoutUrl?: string };
          userErrors?: { message?: string }[];
        }
      | undefined;
    if (payload?.cart?.checkoutUrl) return payload.cart.checkoutUrl;
  } catch {
    // Permalink still lands on Shopify checkout.
  }

  return cartPermalink(usable);
}

export function shopifyStoreUrl() {
  const publicUrl = (process.env.NEXT_PUBLIC_SHOPIFY_URL ?? "").trim();
  if (publicUrl) return publicUrl;
  const host = storeHost();
  return host ? `https://${host}` : "";
}
