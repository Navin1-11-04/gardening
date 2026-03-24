import { Header } from "../../../_components/Header";
import { Footer } from "../../../_components/Footer";
import ProductDetails from "./_components/ProductDetails";

// Dynamic metadata per product — reads from API at request time
export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/products/${params.id}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return { title: "Product — Kavin Organics" };
    const { product } = await res.json();
    return {
      title: `${product.name} — Kavin Organics`,
      description: product.description.slice(0, 155),
    };
  } catch {
    return { title: "Product — Kavin Organics" };
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      {/* Pass the real id — ProductDetails fetches the correct product */}
      <ProductDetails productId={params.id} />
      <Footer />
    </>
  );
}