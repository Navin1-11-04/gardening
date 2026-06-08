// app/(main)/shop/product/[id]/page.tsx
// Adds Product JSON-LD structured data + full Open Graph per product

import { Header } from "../../../_components/Header";
import { Footer } from "../../../_components/Footer";
import ProductDetails from "./_components/ProductDetails";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://kavinorganics.in";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "Product — Kavin Organics" };
    const { product } = await res.json();

    const title       = `${product.name} — Kavin Organics`;
    const description = product.description.slice(0, 155);
    const image       = product.images?.[0] ?? `${BASE_URL}/og-image.jpg`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url:    `${BASE_URL}/shop/product/${id}`,
        type:   "website",
        images: [{ url: image, width: 800, height: 800, alt: product.name }],
      },
      twitter: {
        card:        "summary_large_image",
        title,
        description,
        images:      [image],
      },
    };
  } catch {
    return { title: "Product — Kavin Organics" };
  }
}

// Build Product JSON-LD for Google Shopping / rich results
async function getProductJsonLd(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const { product } = await res.json();

    return {
      "@context": "https://schema.org",
      "@type":    "Product",
      name:        product.name,
      description: product.description,
      image:       product.images ?? [],
      sku:         product.sku,
      brand: {
        "@type": "Brand",
        name:    "Kavin Organics",
      },
      offers: {
        "@type":         "Offer",
        url:             `${BASE_URL}/shop/product/${id}`,
        priceCurrency:   "INR",
        price:           product.price,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name:    "Kavin Organics",
        },
      },
      aggregateRating: product.reviews > 0
        ? {
            "@type":       "AggregateRating",
            ratingValue:   product.rating,
            reviewCount:   product.reviews,
            bestRating:    5,
            worstRating:   1,
          }
        : undefined,
    };
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jsonLd = await getProductJsonLd(id);

  return (
    <>
      <Header />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetails productId={id} />
      <Footer />
    </>
  );
}