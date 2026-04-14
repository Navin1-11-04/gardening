import { Suspense } from "react";
import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import OrderConfirmationPage from "./OrderConfirmation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order Confirmed — Kavin Organics",
  description: "Your order has been placed successfully.",
};

export default function OrderConfirmation() {
  return (
    <>
      <Header />

      <Suspense fallback={<div>Loading...</div>}>
        <OrderConfirmationPage />
      </Suspense>

      <Footer />
    </>
  );
}