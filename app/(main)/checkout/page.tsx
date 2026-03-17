import CheckoutPage from "../_components/CheckOut";
import { Header } from "../_components/Header";

// No footer on checkout — keeps users focused on completing the purchase
export const metadata = {
  title: "Checkout — Kavin Organics",
  description: "Securely complete your order.",
};

export default function Checkout() {
  return (
    <>
      <Header />
      <CheckoutPage />
    </>
  );
}