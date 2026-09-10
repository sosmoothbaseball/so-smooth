import type { Metadata } from "next";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import CTASection from "@/components/home/CTASection";
import { SHOPIFY_STOREFRONT_URL } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Shop | So Smooth",
  description: "So Smooth gear. Storefront will connect to Shopify.",
};

const CATEGORIES = ["All", "Tops", "Hats", "Training", "Travel"];

const PRODUCTS = [
  { sku: "SS-01", name: "Practice Tee", category: "Tops", price: "$32" },
  { sku: "SS-02", name: "Mark Hoodie", category: "Tops", price: "$64" },
  { sku: "SS-03", name: "Snapback", category: "Hats", price: "$28" },
  { sku: "SS-04", name: "Cage Shorts", category: "Training", price: "$36" },
  { sku: "SS-05", name: "Travel Jersey", category: "Travel", price: "$58" },
  { sku: "SS-06", name: "Bat Pack", category: "Training", price: "$48" },
  { sku: "SS-07", name: "Field Bottle", category: "Training", price: "$18" },
  { sku: "SS-08", name: "Dad Hat", category: "Hats", price: "$26" },
];

export default function ShopPage() {
  const shopHref = SHOPIFY_STOREFRONT_URL || undefined;

  return (
    <>
      <PageHero
        eyebrow="Gear"
        title={
          <>
            The <span className="text-green-400">Shop</span>
          </>
        }
        description="Sample store so this tab never looks blank. When Shopify is live, these cards point at the real storefront."
        actions={
          shopHref ? (
            <Button href={shopHref} size="lg" external>
              Open Store
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          ) : undefined
        }
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              eyebrow="Catalog"
              title="Sample Drops"
              description="Eight example products. Swap names, photos, and prices when the store is ready."
            />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category, i) => (
                <span
                  key={category}
                  className={
                    i === 0
                      ? "rounded-full bg-green-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-bone"
                      : "rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink/60"
                  }
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <StaggerGroup className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <StaggerItem key={product.sku}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white">
                  <div className="relative flex aspect-square items-center justify-center bg-green-800">
                    <div className="bg-grid absolute inset-0 opacity-25" />
                    <ShoppingBag className="relative h-10 w-10 text-yellow-400" />
                    <span className="absolute left-3 top-3 rounded-full bg-bone px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-ink/35">
                      {product.sku}
                    </p>
                    <h3 className="mt-1 font-display text-2xl uppercase tracking-wide text-ink">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-green-700">{product.price}</p>
                    {shopHref ? (
                      <Button href={shopHref} size="sm" className="mt-5 w-full" external>
                        View In Shop
                      </Button>
                    ) : (
                      <span className="mt-5 inline-flex items-center justify-center rounded-full border border-ink/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                        Coming to Shopify
                      </span>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <CTASection
        eyebrow="Wear The Work"
        title={
          <>
            Gear Follows The <span className="text-yellow-400">Standard</span>
          </>
        }
        description="Storefront connects later. Training and teams are open now."
        primary={{ href: "/training", label: "View Training" }}
        secondary={{ href: "/team", label: "See Teams" }}
      />
    </>
  );
}
