import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Phone,
  Leaf,
  Heart,
  ShieldCheck,
  Users,
  Star,
  Truck,
  MessageSquare,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const values = [
  {
    icon: Leaf,
    title: "100% Organic First",
    desc: "We stock only natural, chemical-free products that are safe for your family, your plants, and the earth.",
  },
  {
    icon: Heart,
    title: "Gardeners Helping Gardeners",
    desc: "Our team loves gardening just as much as you do. We give honest advice — not just a sales pitch.",
  },
  {
    icon: ShieldCheck,
    title: "Quality You Can Trust",
    desc: "Every product we sell is tested and trusted. If you are not happy, we will make it right — no questions asked.",
  },
  {
    icon: Users,
    title: "Here for Every Gardener",
    desc: "Whether you are 25 or 75, a beginner or experienced — we make gardening easy, enjoyable, and accessible for everyone.",
  },
];

const stats = [
  { number: "12,000+", label: "Happy Customers" },
  { number: "8 Years", label: "In Business" },
  { number: "500+", label: "Products" },
  { number: "4.9 / 5", label: "Customer Rating" },
];

const team = [
  {
    name: "Kavin Raj",
    role: "Founder & Garden Expert",
    bio: "Kavin started growing vegetables on his rooftop in 2017 and fell in love with organic gardening. He founded Kavin Organics to make quality garden supplies accessible to everyone in Tamil Nadu.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  },
  {
    name: "Priya Kavin",
    role: "Customer Care & Operations",
    bio: "Priya manages day-to-day operations and makes sure every customer is taken care of. She personally responds to calls and messages to ensure every order arrives perfectly.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  },
  {
    name: "Rajan M.",
    role: "Horticulture Advisor",
    bio: "With over 20 years of farming experience, Rajan guides our product selection and provides free gardening advice to customers who call with plant questions.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
  },
];

const reviews = [
  {
    name: "Sumathi P., Erode",
    rating: 5,
    comment: "I have been ordering from Kavin Organics for 2 years now. The quality is always excellent and delivery is on time. Rajan's gardening advice over the phone has been so helpful!",
  },
  {
    name: "Annamalai S., Salem",
    rating: 5,
    comment: "Very honest people. I ordered the wrong product by mistake and they replaced it without any fuss. The vermicompost is the best I have ever used for my terrace garden.",
  },
  {
    name: "Meenakshi R., Namakkal",
    rating: 5,
    comment: "My tomato plants are doing wonderfully after using their seeds and fertilizer. The team helped me step by step over the phone. Truly wonderful service.",
  },
];

// ─── Star Row ─────────────────────────────────────────────────────────────────

const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={16} className="text-[#d4a017] fill-[#d4a017]" />
    ))}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">About Us</span>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1440&auto=format&fit=crop"
            alt="Garden background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#1e3d18]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Leaf size={20} className="text-white" />
              </div>
              <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Our Story</p>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-outfit text-white leading-tight mb-6">
              Growing Green Since 2017
            </h1>
            <p className="text-lg sm:text-xl text-white/85 leading-relaxed">
              We started as a small rooftop garden in Thiruchengode and grew into Tamil Nadu's most trusted source for organic gardening supplies — because we believe everyone deserves to grow their own food.
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats bar ─────────────────────────────────── */}
      <div className="bg-[#3d6b35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/20">
            {stats.map(({ number, label }) => (
              <div key={label} className="flex flex-col items-center text-center py-6 sm:py-8 px-4">
                <span className="text-3xl sm:text-4xl font-black text-white font-outfit">{number}</span>
                <span className="text-white/70 text-sm sm:text-base font-medium mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Our Story ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-sm font-bold text-[#7a9e5f] uppercase tracking-wider mb-3">How We Started</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-[#2a2a1e] leading-tight mb-6">
              From One Rooftop Garden to 12,000 Happy Customers
            </h2>
            <div className="flex flex-col gap-5 text-base sm:text-lg text-[#3a3a2e] leading-relaxed">
              <p>
                It all started in 2017 when Kavin, a software engineer from Thiruchengode, converted his rooftop into a vegetable garden. He couldn't find good quality organic seeds and fertilizers locally — most shops sold chemical products or unreliable seeds.
              </p>
              <p>
                So he began sourcing them directly from trusted farmers and organic suppliers. Neighbours and friends started asking for the same products. Word spread. By 2019, Kavin Organics was born.
              </p>
              <p>
                Today we serve over 12,000 home gardeners across Tamil Nadu — from young apartment dwellers growing herbs on a windowsill, to retired grandparents tending terrace gardens they've nurtured for decades.
              </p>
              <p>
                Our promise has never changed: <span className="font-bold text-[#3d6b35]">honest products, fair prices, and a team that actually cares about your garden.</span>
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[350px] sm:h-[480px] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop"
                alt="Our garden"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-5 -left-4 sm:-left-8 bg-white rounded-2xl border border-[#e8e0d0] shadow-xl p-5 max-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <Stars />
              </div>
              <p className="text-sm font-bold text-[#2a2a1e]">"My tomatoes have never looked better!"</p>
              <p className="text-xs text-[#7a7a68] mt-1">— Meenakshi, Namakkal</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Values ────────────────────────────────────── */}
      <div className="bg-white border-t border-b border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-sm font-bold text-[#7a9e5f] uppercase tracking-wider mb-3">What We Stand For</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-[#2a2a1e]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-4 bg-[#faf7f2] border border-[#e8e0d0] rounded-2xl p-5 sm:p-6">
                <div className="w-12 h-12 rounded-xl bg-[#3d6b35] flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2a2a1e] mb-2">{title}</h3>
                  <p className="text-base text-[#5a5a48] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Team ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-sm font-bold text-[#7a9e5f] uppercase tracking-wider mb-3">The People Behind Your Garden</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-[#2a2a1e]">Meet Our Team</h2>
          <p className="text-base sm:text-lg text-[#5a5a48] mt-3 max-w-xl mx-auto leading-relaxed">
            When you call us, these are the real people who pick up — not a call centre.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden hover:border-[#a8c890] hover:shadow-md transition-all"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden bg-[#f0ece4]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="p-5 sm:p-6 flex flex-col gap-2">
                <div>
                  <h3 className="text-xl font-bold text-[#2a2a1e]">{member.name}</h3>
                  <p className="text-sm font-semibold text-[#3d6b35]">{member.role}</p>
                </div>
                <p className="text-base text-[#5a5a48] leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Customer Reviews ──────────────────────────── */}
      <div className="bg-[#3d6b35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-white/70 text-sm font-bold uppercase tracking-wider mb-3">What Our Customers Say</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-white">
              Trusted by Gardeners Across Tamil Nadu
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {reviews.map((review) => (
              <div key={review.name} className="bg-white/10 border border-white/20 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
                <Stars count={review.rating} />
                <p className="text-base sm:text-lg text-white leading-relaxed">
                  "{review.comment}"
                </p>
                <p className="text-white/60 text-sm font-semibold mt-auto">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why Choose Us ─────────────────────────────── */}
      <div className="bg-white border-t border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-[#7a9e5f] uppercase tracking-wider mb-3">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-[#2a2a1e]">The Kavin Organics Difference</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: ShieldCheck, title: "Quality Guaranteed", desc: "Every product is tested before it reaches you. Not happy? We'll make it right." },
              { icon: Truck, title: "Fast & Reliable Delivery", desc: "Free delivery on orders above ₹999. Most orders delivered in 2–4 days." },
              { icon: Phone, title: "Real People on the Phone", desc: "Call us and speak to a real person — not a bot, not a script." },
              { icon: Leaf, title: "Genuinely Organic", desc: "No greenwashing. Our organic products are truly natural and chemical-free." },
              { icon: Heart, title: "After-Sales Care", desc: "We follow up after delivery to make sure your plants are doing well." },
              { icon: Users, title: "Free Gardening Advice", desc: "Call us with any gardening question — our advice is always free." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 bg-[#faf7f2] border border-[#e8e0d0] rounded-2xl p-5">
                <div className="w-11 h-11 rounded-xl bg-[#eef5ea] flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-[#3d6b35]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2a2a1e] mb-1">{title}</h3>
                  <p className="text-sm text-[#5a5a48] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────── */}
      <div className="bg-[#faf7f2] border-t border-[#e8e0d0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-[#2a2a1e] mb-4">
            Let's Grow Something Together
          </h2>
          <p className="text-base sm:text-lg text-[#5a5a48] leading-relaxed mb-8 max-w-xl mx-auto">
            Whether you're planting your first seed or expanding your terrace garden — we're here to help every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-md"
            >
              <Leaf size={20} />
              Shop Products
            </Link>
            <a
              href="tel:+919876543210"
              className="flex items-center justify-center gap-2 bg-white hover:bg-[#f5f0ea] border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3d6b35] font-bold text-lg px-8 py-4 rounded-xl transition-colors"
            >
              <Phone size={20} />
              Call Us
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white hover:bg-[#f5f0ea] border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3d6b35] font-bold text-lg px-8 py-4 rounded-xl transition-colors"
            >
              <MessageSquare size={20} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}