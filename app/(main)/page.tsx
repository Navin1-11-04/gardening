import { Categories } from "./_components/Category";
import { Footer } from "./_components/Footer";
import { HowToGrow } from "./_components/Guides";
import { Header } from "./_components/Header";
import { HowToOrder } from "./_components/HowToOrder";
import { Slider } from "./_components/Slider";
import { TopSellersSection } from "./_components/TopSellerSection";

export const metadata = {
  title: "Kavin Organics — Home Garden Store",
  description: "Quality seeds, fertilizers, pots and gardening essentials delivered to your door.",
};

export default function Home() {
  return (
    <>
      <Header />
      <Slider />
      <Categories />
      <HowToOrder />
      <TopSellersSection />
      <HowToGrow />
      <Footer />
    </>
  );
}