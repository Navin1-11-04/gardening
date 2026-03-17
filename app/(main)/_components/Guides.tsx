"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const guides = [
  {
    question: "How do I grow tomatoes at home?",
    answer:
      "Start with quality tomato seeds, plant them in well-drained soil or cocopeat, place them in sunlight for 6–8 hours daily, and water consistently. Tomatoes do very well in grow bags on balconies.",
  },
  {
    question: "How often should I water my plants?",
    answer:
      "Most plants prefer slightly moist soil. Water when the top inch of soil feels dry to your touch. Avoid overwatering — soggy soil can harm the roots.",
  },
  {
    question: "What is cocopeat and why should I use it?",
    answer:
      "Cocopeat is a natural growing medium made from coconut husk. It is light, holds water well, and helps roots grow strong. It is great for pots, grow bags, and seed starting.",
  },
  {
    question: "Which fertilizer is best for beginners?",
    answer:
      "We recommend organic fertilizers like vermicompost or slow-release organic blends. They are safe, easy to use, and great for vegetables, flowers, and herbs.",
  },
  {
    question: "Can I grow vegetables on my balcony?",
    answer:
      "Yes! Tomatoes, chilies, spinach, coriander, and herbs all grow very well in pots or grow bags. You just need at least 4–6 hours of sunlight each day.",
  },
];

export const HowToGrow = () => {
  return (
    <section className="w-full py-10 sm:py-16 px-4 sm:px-6 bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14">

        {/* Left */}
        <div>
          <p className="text-sm tracking-[0.2em] uppercase text-[#7a9e5f] font-semibold mb-3">
            Gardening Guides
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-outfit text-[#2a2a1e] leading-tight">
            Common Questions<br />Answered
          </h2>
          <p className="text-base sm:text-lg text-[#5a5a48] mt-4 leading-relaxed max-w-sm">
            Simple answers to help you grow a healthy, happy garden at home.
          </p>

          <div className="mt-6 p-5 bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl">
            <p className="text-base font-bold text-[#3d6b35] mb-1">Still have questions?</p>
            <p className="text-sm text-[#5a5a48] mb-3">Our garden experts are happy to help you.</p>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 bg-[#3d6b35] text-white font-bold text-base px-5 py-3 rounded-xl hover:bg-[#335c2c] transition-colors"
            >
              📞 Call Us
            </a>
          </div>
        </div>

        {/* Right — larger accordion text */}
        <div>
          <Accordion type="single" collapsible className="w-full border-none">
            {guides.map((guide, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b-2 border-[#e8e0d0] !bg-transparent"
              >
                <AccordionTrigger className="py-5 sm:py-6 text-left text-base sm:text-lg font-bold text-[#2a2a1e] hover:no-underline hover:text-[#3d6b35] !bg-transparent transition-colors">
                  {guide.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 sm:pb-6 text-base sm:text-lg text-[#5a5a48] leading-relaxed !bg-transparent">
                  {guide.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
};