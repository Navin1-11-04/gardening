import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import PrivacyPage from "../_components/PrivacyPage";


export const metadata = {
  title: "Privacy Policy & Terms — Kavin Organics",
  description: "How we use your information and our terms of service — in plain language.",
};

export default function Privacy() {
  return (
    <>
      <Header />
      <PrivacyPage />
      <Footer />
    </>
  );
}