import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import OrderConfirmationPage from "./OrderConfirmation";

export const metadata = {
  title: "Order Confirmed — Kavin Organics",
  description: "Your order has been placed successfully.",
};

export default function OrderConfirmation() {
  return (
    <>
      <Header />
      <OrderConfirmationPage />
      <Footer />
    </>
  );
}