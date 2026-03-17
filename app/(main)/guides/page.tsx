import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import GuidesPage from "../_components/GuidesPage";

export const metadata = {
  title: "Gardening Guides — Kavin Organics",
  description: "Free step-by-step gardening guides for home gardeners. Learn how to grow vegetables, herbs, and flowers on your balcony or terrace.",
};

export default function Guides() {
  return (
    <>
      <Header />
      <GuidesPage />
      <Footer />
    </>
  );
}