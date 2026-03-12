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
      "Start with quality tomato seeds, plant them in well-drained soil or cocopeat, place them in sunlight for 6–8 hours daily, and water consistently.",
  },
  {
    question: "How often should I water plants?",
    answer:
      "Most plants prefer slightly moist soil. Water when the top inch of soil feels dry. Avoid overwatering.",
  },
  {
    question: "What is cocopeat and why use it?",
    answer:
      "Cocopeat is a natural growing medium made from coconut husk. It improves water retention and root growth.",
  },
  {
    question: "Which fertilizer should beginners use?",
    answer:
      "Organic fertilizers like vermicompost or slow-release organic blends are beginner friendly and safe for most plants.",
  },
  {
    question: "Can I grow vegetables on a balcony?",
    answer:
      "Yes! Tomatoes, chilies, spinach, and herbs grow well in containers or grow bags with enough sunlight.",
  },
];

export const HowToGrow = () => {
  return (
    <section className="w-full py-16 px-6 bg-background text-foreground">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT */}
        <div>
          <p className="text-xs text-gray-500 mb-3">Guides</p>

          <h2 className="text-4xl md:text-5xl font-bold font-outfit">
            How to Grow <br /> Your Garden
          </h2>
        </div>

        {/* RIGHT */}
        <div>
          <Accordion type="single" collapsible className="w-full border-none">
            {guides.map((guide, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-gray-300 !bg-transparent"
              >
                <AccordionTrigger className="py-6 text-left text-lg font-medium hover:no-underline !bg-transparent">
                  {guide.question}
                </AccordionTrigger>

                <AccordionContent className="pb-6 text-base text-foreground/70 leading-relaxed !bg-transparent">
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