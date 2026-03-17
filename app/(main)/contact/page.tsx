import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import ContactPage from "../_components/ContactPage";

export const metadata = {
  title: "Contact Us — Kavin Organics",
  description: "Get in touch with our garden experts. Call, WhatsApp or send us a message.",
};

export default function Contact() {
  return (
    <>
      <Header />
      <ContactPage />
      <Footer />
    </>
  );
}