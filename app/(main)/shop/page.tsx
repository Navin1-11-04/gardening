import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import ShopPage from "../_components/ShopPage";

export const metadata = {
  title: "Shop — Kavin Organics",
  description: "Browse seeds, pots, fertilizers, grow bags and more.",
};

export default function Shop() {
  return (
    <>
      <Header />
      <ShopPage />
      <Footer />
    </>
  );
}