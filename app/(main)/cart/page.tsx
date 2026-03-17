import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import CartPage from "../_components/CartPage";

export const metadata = {
  title: "My Cart — Kavin Organics",
  description: "Review your cart and proceed to checkout.",
};

export default function Cart() {
  return (
    <>
      <Header />
      <CartPage />
      <Footer />
    </>
  );
}