import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import OrdersPage from "../_components/ordersPage";

export const metadata = {
  title: "My Orders — Kavin Organics",
  description: "View and track all your Kavin Organics orders.",
};

export default function Orders() {
  return (
    <>
      <Header />
      <OrdersPage />
      <Footer />
    </>
  );
}