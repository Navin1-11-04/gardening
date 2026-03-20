import { Header } from "../../_components/Header";
import { Footer } from "../../_components/Footer";
import GuideArticlePage from "../../_components/GuideArticlePage";

// In a real app, generate metadata dynamically from slug
export const metadata = {
  title: "The Complete Beginner's Guide to Home Gardening — Kavin Organics",
  description: "Step-by-step guide to starting your home garden. Covers seeds, soil, watering, sunlight and harvesting.",
};

export default function GuideArticle({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />
      <GuideArticlePage slug={params.slug} />
      <Footer />
    </>
  );
}