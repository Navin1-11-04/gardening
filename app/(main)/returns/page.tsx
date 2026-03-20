import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import ReturnsPage from "../_components/ReturnsPage";


export const metadata = {
  title: "Returns & Refunds — Kavin Organics",
  description: "Easy 7-day returns. We pick up from your home and refund in full.",
};

export default function Returns() {
  return (
    <>
      <Header />
      <ReturnsPage />
      <Footer />
    </>
  );
}