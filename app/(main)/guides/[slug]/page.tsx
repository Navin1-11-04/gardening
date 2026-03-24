import { Header } from "../../_components/Header";
import { Footer } from "../../_components/Footer";
import GuideArticlePage from "../../_components/GuideArticlePage";

// In a real app, generate metadata dynamically from slug
export const metadata = {
  title: "The Complete Beginner's Guide to Home Gardening — Kavin Organics",
  description: "Step-by-step guide to starting your home garden. Covers seeds, soil, watering, sunlight and harvesting.",
};

export default async function GuideArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <>
      <Header />
      <GuideArticlePage slug={slug} />
      <Footer />
    </>
  );
}