import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import AboutPage from "../_components/AboutPage";

export const metadata = {
  title: "About Us — Kavin Organics",
  description: "Learn the story behind Kavin Organics — Tamil Nadu's trusted source for organic gardening supplies since 2017.",
};

export default function About() {
  return (
    <>
      <Header />
      <AboutPage />
      <Footer />
    </>
  );
}