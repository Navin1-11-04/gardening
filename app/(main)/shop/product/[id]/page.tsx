import { Header } from "../../../_components/Header";
import { Footer } from "../../../_components/Footer";
import ProductDetails from "./_components/ProductDetails";

export const metadata = {
  title: "Premium Vermicompost — Kavin Organics",
  description: "100% organic vermicompost for healthier plants. Free delivery above ₹999.",
};

// In a real app, you'd use `params.id` to fetch product data from your DB/API
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <ProductDetails />
      <Footer />
    </>
  );
}