import type { Metadata } from "next";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import CTASection from "@/components/home/CTASection";
import ProductGrid from "@/components/shop/ProductGrid";
import { getShopifyProducts, shopifyStoreUrl } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop | So Smooth",
  description: "So Smooth gear. Add to your bag here, then finish checkout on Shopify.",
};

export default async function ShopPage() {
  const products = await getShopifyProducts();
  const storeUrl = shopifyStoreUrl();

  return (
    <>
      <PageHero
        eyebrow="Gear"
        title={
          <>
            The <span className="text-green-400">Shop</span>
          </>
        }
        description="Add gear to your bag on this site. Checkout, shipping, and payment finish on Shopify."
        actions={
          storeUrl ? (
            <Button href={storeUrl} size="lg" external>
              Open Shopify Store
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          ) : undefined
        }
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            align="left"
            eyebrow="Catalog"
            title={products.length ? "The Drops" : "Shop Coming Online"}
            description={
              products.length
                ? "Tap a piece, add it to the bag, then check out when you are ready."
                : "We could not load products yet. Confirm the Shopify domain and Storefront token, then refresh."
            }
          />

          <div className="mt-10">
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-ink/10 bg-white px-6 py-16 text-center">
                <ShoppingBag className="h-10 w-10 text-green-700" />
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/60">
                  The bag is wired. Once Shopify returns products, they show up here automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Wear The Work"
        title={
          <>
            Gear Follows The <span className="text-yellow-400">Standard</span>
          </>
        }
        description="The mini-cart lives here. The full checkout is Shopify."
        primary={{ href: "/training", label: "View Training" }}
        secondary={{ href: "/team", label: "See Teams" }}
      />
    </>
  );
}
