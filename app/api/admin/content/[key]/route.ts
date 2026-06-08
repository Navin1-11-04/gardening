// app/api/admin/content/[key]/route.ts
// Fixed: GET now returns static defaults directly when DB is unavailable
// instead of making a self-fetch that can fail in serverless environments.

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Content } from "@/models/Content";
import { requireAdminAuth } from "@/lib/adminAuthServer";

const LABELS: Record<string, string> = {
  homepage: "Homepage (Slider & Announcement)",
  about:    "About Us Page",
  faq:      "FAQs Page",
  shipping: "Shipping & Delivery Page",
  returns:  "Returns & Refunds Page",
  contact:  "Contact Page",
};

// ── Inline defaults (same as app/api/content/[key]/route.ts) ─────────────────
// Duplicated here so admin GET never depends on a self-fetch or DB being up.
const DEFAULTS: Record<string, any> = {
  homepage: {
    sliderItems: [
      {
        imgUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1440&auto=format&fit=crop",
        tag: "Premium Seeds",
        title: "Grow healthy plants from the finest seeds.",
        subtitle: "Handpicked varieties for home & balcony gardens.",
        ctaText: "Shop Seeds",
        ctaHref: "/shop?cat=seeds",
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1440&auto=format&fit=crop",
        tag: "Stylish Pots",
        title: "Beautiful pots for every corner of your home.",
        subtitle: "Terracotta, ceramic & plastic in all sizes.",
        ctaText: "Shop Pots",
        ctaHref: "/shop?cat=pots",
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1440&auto=format&fit=crop",
        tag: "Organic Fertilizers",
        title: "Nourish your garden, naturally.",
        subtitle: "Safe, organic blends for healthier plants.",
        ctaText: "Shop Fertilizers",
        ctaHref: "/shop?cat=fertilizers",
      },
    ],
    announcementBar: "Free delivery on orders above ₹999 | Call us: +91 98765 43210",
    howToOrderVideoUrl: "",
  },

  about: {
    heroTitle: "Growing Green Since 2017",
    heroSubtitle: "We started as a small rooftop garden in Thiruchengode and grew into Tamil Nadu's most trusted source for organic gardening supplies.",
    storyParagraphs: [
      "It all started in 2017 when Kavin, a software engineer from Thiruchengode, converted his rooftop into a vegetable garden.",
      "So he began sourcing products directly from trusted farmers. Word spread. By 2019, Kavin Organics was born.",
      "Today we serve over 12,000 home gardeners across Tamil Nadu.",
      "Our promise has never changed: honest products, fair prices, and a team that cares.",
    ],
    stats: [
      { number: "12,000+", label: "Happy Customers" },
      { number: "8 Years",  label: "In Business" },
      { number: "500+",     label: "Products" },
      { number: "4.9 / 5", label: "Customer Rating" },
    ],
    teamMembers: [
      {
        name: "Kavin Raj", role: "Founder & Garden Expert",
        bio: "Kavin started growing vegetables on his rooftop in 2017 and fell in love with organic gardening.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      },
      {
        name: "Priya Kavin", role: "Customer Care & Operations",
        bio: "Priya manages day-to-day operations and makes sure every customer is taken care of.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
      },
    ],
    reviews: [
      { name: "Sumathi P., Erode",   rating: 5, comment: "I have been ordering from Kavin Organics for 2 years. The quality is always excellent." },
      { name: "Annamalai S., Salem", rating: 5, comment: "Very honest people. I ordered the wrong product by mistake and they replaced it without any fuss." },
    ],
  },

  faq: {
    groups: [
      {
        id: "ordering", emoji: "🛒", label: "Ordering & Payment",
        faqs: [
          { id: "o1", question: "How do I place an order?", answer: "Browse our products, tap 'Add to Cart', then proceed to checkout. Enter your address, choose payment and confirm." },
          { id: "o2", question: "What payment methods do you accept?", answer: "Cash on Delivery, UPI (GPay, PhonePe), Credit & Debit Cards, and Net Banking." },
          { id: "o3", question: "Can I pay cash when the order is delivered?", answer: "Yes! Cash on Delivery is available for all orders." },
        ],
      },
      {
        id: "delivery", emoji: "🚚", label: "Delivery",
        faqs: [
          { id: "d1", question: "How long does delivery take?", answer: "Most orders are delivered within 2 to 4 business days." },
          { id: "d2", question: "How much does delivery cost?", answer: "Free on orders above ₹999. A small charge of ₹79 applies below that." },
        ],
      },
      {
        id: "returns", emoji: "↩️", label: "Returns & Refunds",
        faqs: [
          { id: "r1", question: "Can I return a product?", answer: "Yes — simple 7-day returns. Contact us within 7 days and we'll arrange pickup from your home." },
        ],
      },
    ],
  },

  shipping: {
    freeThreshold: 999,
    standardFee: 79,
    deliveryZones: [
      { zone: "Namakkal & nearby towns",     time: "Next day", fee: "FREE above ₹999" },
      { zone: "Erode, Salem, Dharmapuri",    time: "1–2 days", fee: "FREE above ₹999" },
      { zone: "Coimbatore, Trichy, Madurai", time: "2–3 days", fee: "FREE above ₹999" },
      { zone: "Chennai, Other Tamil Nadu",   time: "2–4 days", fee: "FREE above ₹999" },
    ],
    packagingNote: "Seeds are packed in airtight pouches. Pots are bubble-wrapped. All items inspected before dispatch.",
    businessDays: "Monday to Saturday (excluding public holidays)",
  },

  returns: {
    windowDays: 7,
    refundDays: "3–5 business days",
    eligible: [
      "Product is defective or damaged on arrival",
      "Wrong product was delivered",
      "Product is significantly different from the description",
      "You changed your mind (within 7 days, product unused)",
    ],
    notEligible: [
      "Products returned after 7 days of delivery",
      "Used products (other than defective)",
      "Seeds where poor germination is due to growing conditions",
    ],
    process: [
      { step: "1", title: "Call or WhatsApp us", desc: "Contact us within 7 days with your Order ID." },
      { step: "2", title: "We arrange pickup",   desc: "Our delivery partner collects from your home." },
      { step: "3", title: "Refund processed",    desc: "Refund issued within 3–5 business days." },
    ],
  },

  contact: {
    phone: "+91 98765 43210",
    email: "hello@kavinorganics.in",
    address: "No. 45, Market Road, Thiruchengode — 637211, Namakkal District, Tamil Nadu",
    hours: {
      weekdays: { open: "9:00 AM", close: "6:00 PM" },
      saturday: { open: "9:00 AM", close: "4:00 PM" },
    },
    whatsapp: "919876543210",
  },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  const { key } = await params;

  // Always return something — DB failure should fall back to defaults
  try {
    await connectDB();
    const doc = await Content.findOne({ key }).lean();
    if (doc) {
      return NextResponse.json({
        key,
        value:     (doc as any).value,
        updatedAt: (doc as any).updatedAt,
      });
    }
  } catch (error) {
    // DB unavailable — fall through to defaults below
    console.warn("Content GET: DB unavailable, using defaults for key:", key);
  }

  // Return defaults so the admin editor is never empty
  const fallback = DEFAULTS[key];
  if (!fallback) {
    return NextResponse.json({ error: "Unknown content key" }, { status: 404 });
  }
  return NextResponse.json({ key, value: fallback, updatedAt: null });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  const { key } = await params;

  if (!LABELS[key]) {
    return NextResponse.json({ error: "Unknown content key" }, { status: 400 });
  }

  try {
    const { value } = await request.json();
    if (!value || typeof value !== "object") {
      return NextResponse.json({ error: "Value must be a JSON object" }, { status: 400 });
    }

    await connectDB();
    await Content.findOneAndUpdate(
      { key },
      { $set: { key, label: LABELS[key], value } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Saved successfully", key });
  } catch (error) {
    console.error("Content PUT error:", error);
    return NextResponse.json({ error: "Failed to save content. Please check your database connection." }, { status: 500 });
  }
}