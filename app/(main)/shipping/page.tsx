import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import ShippingPage from "../_components/ShippingPage";


export const metadata = {
  title: "Shipping & Delivery — Kavin Organics",
  description: "Free delivery on orders above ₹999. Delivered across Tamil Nadu in 2–4 days.",
};

export default function Shipping() {
  return (
    <>
      <Header />
      <ShippingPage />
      <Footer />
    </>
  );
}