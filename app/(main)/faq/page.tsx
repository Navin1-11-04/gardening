import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import FAQPage from "../_components/FAQPage";

export const metadata = {
  title: "FAQs — Kavin Organics",
  description: "Find answers to common questions about ordering, delivery, returns, products and gardening.",
};

export default function FAQ() {
  return (
    <>
      <Header />
      <FAQPage />
      <Footer />
    </>
  );
}