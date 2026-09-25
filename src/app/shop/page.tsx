import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import CTASection from "@/components/home/CTASection";
import PreorderBanner from "@/components/shop/PreorderBanner";
import ProductGrid from "@/components/shop/ProductGrid";
import { getShopifyProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop | So Smooth",
  description: "So Smooth gear.",
};

export default async function ShopPage() {
  const products = await getShopifyProducts();

  return (
    <>
      <PageHero
        eyebrow="Gear"
        title={
          <>
            The <span className="text-green-400">Shop</span>
          </>
        }
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <PreorderBanner />
          </div>
          <SectionHeading
            align="left"
            eyebrow="Catalog"
            title={products.length ? "The Drops" : "Shop Coming Online"}
            description={
              products.length
                ? undefined
                : "We could not load products yet. Confirm the Shopify store domain, then refresh."
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
        description=""
        primary={{ href: "/training", label: "View Training" }}
        secondary={{ href: "/team", label: "See Teams" }}
      />
    </>
  );
}
