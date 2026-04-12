// ─── Product type ─────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  nameTa?: string;       // Tamil name shown alongside English
  subtitle: string;
  subtitleTa?: string;   // Tamil subtitle
  description: string;
  highlights: string[];
  howToUse: { step: string; title: string; desc: string }[];
  price: number;
  originalPrice?: number;
  badge?: string;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  weights: string[];
  sku: string;
  inStock: boolean;
  deliveryDays: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const products: Product[] = [
  // ── Seeds ──────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Tomato Seeds",
    nameTa: "தக்காளி விதைகள்",
    subtitle: "Pack of 50 seeds",
    subtitleTa: "50 விதைகள் பேக்",
    description: "Premium hybrid tomato seeds suited for balcony pots and grow bags. High germination rate, disease-resistant variety that produces firm, juicy tomatoes in 60–70 days.",
    highlights: ["50 seeds per pack", "Germination rate above 90%", "Suitable for pots and grow bags", "Ready in 60–70 days", "Disease-resistant hybrid variety"],
    howToUse: [
      { step: "1", title: "Sow seeds", desc: "Sow 2–3 seeds per cell in a seed tray filled with cocopeat. Cover lightly." },
      { step: "2", title: "Water gently", desc: "Mist with water daily. Keep soil moist but not waterlogged." },
      { step: "3", title: "Transplant", desc: "When seedlings are 3–4 inches tall, transplant to a pot or grow bag." },
    ],
    price: 149,
    badge: "Best Seller",
    category: "seeds",
    images: [
      "https://i.pinimg.com/1200x/a2/14/7a/a2147ab076dc62793447212faf8f1a62.jpg",
      "https://i.pinimg.com/1200x/bd/02/43/bd024358692933117b317914c3698664.jpg",
    ],
    rating: 5, reviews: 128, weights: ["1 pack (50 seeds)", "3 pack bundle"],
    sku: "KO-SEED-001", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 2,
    name: "Spinach Seeds",
    nameTa: "கீரை விதைகள்",
    subtitle: "Easy to grow at home",
    subtitleTa: "வீட்டிலேயே எளிதாக வளர்க்கலாம்",
    description: "Fast-growing spinach seeds ideal for beginners. Ready to harvest in just 3 weeks, making them perfect for continuous cropping on balconies and terraces.",
    highlights: ["Harvest in 3–4 weeks", "High yield per pot", "Rich in iron and vitamins", "Grows well in partial shade", "Re-sow every 2 weeks for continuous harvest"],
    howToUse: [
      { step: "1", title: "Sow directly", desc: "Scatter seeds directly into a pot with potting mix. No transplanting needed." },
      { step: "2", title: "Water regularly", desc: "Keep soil moist. Spinach needs consistent watering." },
      { step: "3", title: "Harvest outer leaves", desc: "Pick outer leaves once the plant is 3 inches tall. The plant keeps growing." },
    ],
    price: 89,
    badge: "New",
    category: "seeds",
    images: [
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80",
    ],
    rating: 4, reviews: 64, weights: ["1 pack (100 seeds)"],
    sku: "KO-SEED-002", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 3,
    name: "Chilli Seeds",
    nameTa: "மிளகாய் விதைகள்",
    subtitle: "Pack of 30 seeds",
    subtitleTa: "30 விதைகள் பேக்",
    description: "Hot and productive chilli variety perfect for home gardens. Plants produce abundantly over many months with minimal care, making them one of the easiest vegetables to grow.",
    highlights: ["30 seeds per pack", "High yield throughout the season", "Suitable for pots as small as 8 inches", "Both green and red stage usable", "Very low maintenance"],
    howToUse: [
      { step: "1", title: "Sow in tray", desc: "Sow in seed tray with cocopeat. Germination in 7–10 days." },
      { step: "2", title: "Transplant at 4 weeks", desc: "Move to a pot once plants have 4 true leaves." },
      { step: "3", title: "Harvest regularly", desc: "Pick chillies frequently to encourage more production." },
    ],
    price: 99, originalPrice: 129,
    badge: "Sale",
    category: "seeds",
    images: [
      "https://i.pinimg.com/1200x/4c/d7/96/4cd796857e1624dabf05ed3ffd9f2dc3.jpg",
      "https://i.pinimg.com/1200x/2b/5b/47/2b5b47767eb49e81930b93cbc5693370.jpg",
    ],
    rating: 4, reviews: 87, weights: ["1 pack (30 seeds)"],
    sku: "KO-SEED-003", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 4,
    name: "Coriander Seeds",
    nameTa: "கொத்தமல்லி விதைகள்",
    subtitle: "Pack of 100 seeds",
    subtitleTa: "100 விதைகள் பேக்",
    description: "Fresh coriander seeds for continuous kitchen garden harvest. Sow directly in pots and harvest leaves within 3 weeks. One of the most popular herbs for Indian home gardens.",
    highlights: ["100 seeds per pack", "Ready in 3 weeks", "Perfect for kitchen windowsills", "Cut-and-come-again variety", "Strong aroma"],
    howToUse: [
      { step: "1", title: "Sow densely", desc: "Scatter seeds densely over moist potting mix. Cover with a thin layer of soil." },
      { step: "2", title: "Keep moist", desc: "Water gently daily. Avoid waterlogging." },
      { step: "3", title: "Harvest", desc: "Snip leaves from the top once plants are 3 inches tall." },
    ],
    price: 59,
    category: "seeds",
    images: [
      "https://i.pinimg.com/1200x/7c/de/41/7cde410194039f575908d74d26b6d1f9.jpg",
      "https://i.pinimg.com/736x/5f/40/41/5f40417a069e53ae0e7ee0ae8cf3cf48.jpg",
    ],
    rating: 5, reviews: 203, weights: ["1 pack (100 seeds)", "3 pack bundle"],
    sku: "KO-SEED-004", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 5,
    name: "Marigold Seeds",
    nameTa: "சாமந்தி விதைகள்",
    subtitle: "Vibrant flowering variety",
    subtitleTa: "அழகான மலர் வகை",
    description: "Bright orange and yellow marigold seeds that bloom abundantly and naturally repel pests. A must-have for any kitchen garden — beautiful and functional.",
    highlights: ["Natural pest repellent", "Blooms in 6–8 weeks", "Attracts beneficial insects", "Low water requirement", "Long blooming season"],
    howToUse: [
      { step: "1", title: "Sow seeds", desc: "Sow 2 seeds per pot. They germinate in 5–7 days." },
      { step: "2", title: "Thin seedlings", desc: "Keep one plant per pot once both seeds germinate." },
      { step: "3", title: "Deadhead flowers", desc: "Remove spent blooms to encourage continuous flowering." },
    ],
    price: 79,
    badge: "Popular",
    category: "seeds",
    images: [
      "https://i.pinimg.com/1200x/a4/49/1b/a4491bb2b9f61201f9c19d401f471724.jpg",
      "https://i.pinimg.com/1200x/d7/0f/5c/d70f5c33941429100f8b5b4c88129a82.jpg",
    ],
    rating: 4, reviews: 56, weights: ["1 pack (50 seeds)"],
    sku: "KO-SEED-005", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 6,
    name: "Basil Seeds",
    nameTa: "துளசி விதைகள்",
    subtitle: "Aromatic herb seeds",
    subtitleTa: "மணமுள்ள மூலிகை விதைகள்",
    description: "Sweet basil seeds perfect for windowsill growing. Fresh basil is indispensable in the kitchen and this variety produces lush, fragrant leaves with very little effort.",
    highlights: ["Ready in 3–4 weeks", "Strong aromatic fragrance", "Great for windowsills", "Pinch regularly for bushier growth", "Companion plant — deters aphids"],
    howToUse: [
      { step: "1", title: "Sow on surface", desc: "Press seeds onto moist potting mix. Don't cover — needs light to germinate." },
      { step: "2", title: "Keep warm", desc: "Germination in 7–14 days. Needs 25°C+ for best results." },
      { step: "3", title: "Pinch tips", desc: "Regularly pinch growing tips to prevent flowering and keep leaves coming." },
    ],
    price: 69,
    badge: "New",
    category: "seeds",
    images: [
      "https://i.pinimg.com/736x/75/f2/23/75f2232abd70661e3d6b1ddc7a02b499.jpg",
      "https://i.pinimg.com/736x/7c/cc/53/7ccc53e558dbb875b29caf63b4f29328.jpg",
    ],
    rating: 5, reviews: 91, weights: ["1 pack (40 seeds)"],
    sku: "KO-SEED-006", inStock: true, deliveryDays: "2–4",
  },

  // ── Pots ───────────────────────────────────────────────────────────────────
  {
    id: 7,
    name: "Terracotta Pot",
    nameTa: "மண் குடுவை",
    subtitle: "8 inch — handcrafted",
    subtitleTa: "8 இன்ச் — கை வேலைப்பாடு",
    description: "Traditional handcrafted terracotta pot with drainage hole. The porous clay material allows roots to breathe and regulates moisture naturally — making it the best choice for most plants.",
    highlights: ["8 inch diameter", "Drainage hole at base", "Handcrafted clay — porous and breathable", "Regulates moisture naturally", "Suitable for all plants"],
    howToUse: [
      { step: "1", title: "Soak before use", desc: "Soak new terracotta pots in water for 30 minutes before planting." },
      { step: "2", title: "Use a saucer", desc: "Place a saucer beneath to catch drainage water." },
      { step: "3", title: "Monitor moisture", desc: "Terracotta dries faster than plastic — check moisture more frequently in summer." },
    ],
    price: 249,
    badge: "Best Seller",
    category: "pots",
    images: [
      "https://i.pinimg.com/736x/66/bb/fa/66bbfaeccf82081db60395cc6151863f.jpg",
      "https://i.pinimg.com/1200x/49/01/24/490124d7d0009be990b7e6afa3da4bdb.jpg",
    ],
    rating: 5, reviews: 176, weights: ["6 inch", "8 inch", "10 inch", "12 inch"],
    sku: "KO-POT-001", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 8,
    name: "Ceramic Pot Set",
    nameTa: "மட்பாண்ட குடுவை செட்",
    subtitle: "Set of 3 — white finish",
    subtitleTa: "3 குடுவைகள் — வெள்ளை நிறம்",
    description: "Elegant white ceramic pots with a matte finish. Set of 3 in graduated sizes, perfect for indoor plants, herbs, and succulents. Each pot has a drainage hole and matching saucer.",
    highlights: ["Set of 3 graduated sizes", "Matching saucers included", "Drainage holes in each pot", "Food-safe glaze", "Suitable for indoor and outdoor use"],
    howToUse: [
      { step: "1", title: "Choose the right size", desc: "Use the smallest for herbs, medium for succulents, large for leafy plants." },
      { step: "2", title: "Add drainage layer", desc: "Place a layer of pebbles at the bottom before adding potting mix." },
      { step: "3", title: "Clean regularly", desc: "Wipe with a damp cloth to keep the white finish looking its best." },
    ],
    price: 599, originalPrice: 799,
    badge: "Sale",
    category: "pots",
    images: [
      "https://i.pinimg.com/1200x/e3/4a/44/e34a4426f77c3326952099b65863b88d.jpg",
      "https://i.pinimg.com/736x/04/d4/28/04d428a861219966ef33557fd734519f.jpg",
    ],
    rating: 4, reviews: 43, weights: ["Set of 3 (small + medium + large)"],
    sku: "KO-POT-002", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 9,
    name: "Hanging Planter",
    nameTa: "தொங்கும் தாவர கொத்து",
    subtitle: "Macramé with plastic pot",
    subtitleTa: "மேக்ரமே கயிறு மற்றும் பிளாஸ்டிக் குடுவை",
    description: "Handwoven macramé hanger with a 6-inch plastic pot. Perfect for balconies, windows, and indoor spaces. Creates a beautiful vertical garden without using floor space.",
    highlights: ["6-inch plastic pot included", "Handwoven cotton macramé", "Holds up to 2 kg", "Drainage hole in pot", "Suitable for trailing plants"],
    howToUse: [
      { step: "1", title: "Choose your hook", desc: "Use a ceiling hook or curtain rod rated for at least 3 kg." },
      { step: "2", title: "Plant first", desc: "Plant in the pot, water well, and allow to drain before hanging." },
      { step: "3", title: "Water carefully", desc: "Use a small watering can to avoid overflow. Check drainage saucer." },
    ],
    price: 349,
    badge: "New",
    category: "pots",
    images: [
      "https://i.pinimg.com/736x/50/f8/d3/50f8d34e1c239b7674de657ad6b92f3c.jpg",
    ],
    rating: 4, reviews: 38, weights: ["6 inch pot + hanger"],
    sku: "KO-POT-003", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 10,
    name: "Clay Plant Pot",
    nameTa: "களிமண் குடுவை",
    subtitle: "6 inch — indoor garden",
    subtitleTa: "6 இன்ச் — உள்ளரங்க தோட்டம்",
    description: "Compact 6-inch clay pot ideal for indoor plants, herbs, and small vegetables. The natural clay helps regulate soil temperature and moisture, keeping roots healthy.",
    highlights: ["6 inch diameter", "Natural red clay", "Drainage hole included", "Ideal for herbs and small plants", "Budget-friendly"],
    howToUse: [
      { step: "1", title: "Soak before use", desc: "Soak in water for 20 minutes before first use to prevent the clay from drawing moisture from the soil." },
      { step: "2", title: "Plant with well-draining mix", desc: "Use cocopeat with perlite for best results." },
      { step: "3", title: "Place in bright light", desc: "Most plants suited to this size pot prefer bright indirect light." },
    ],
    price: 179,
    badge: "Popular",
    category: "pots",
    images: [
      "https://i.pinimg.com/736x/19/62/ba/1962ba319e5c7dc4bbd5ff4562260ebe.jpg",
      "https://i.pinimg.com/1200x/65/22/61/652261e52cfa9f847332f56e861ca535.jpg",
    ],
    rating: 5, reviews: 112, weights: ["6 inch", "8 inch"],
    sku: "KO-POT-004", inStock: true, deliveryDays: "2–4",
  },

  // ── Fertilizers ────────────────────────────────────────────────────────────
  {
    id: 11,
    name: "Premium Vermicompost",
    nameTa: "மண்புழு உரம்",
    subtitle: "5 kg — 100% organic",
    subtitleTa: "5 கிலோ — 100% இயற்கை",
    description: "Made from the finest earthworm castings composted over 90 days. Enriches soil structure, improves water retention, and delivers slow-release nutrients directly to plant roots. Safe for all plants.",
    highlights: ["Rich in N, P, K", "Improves soil texture and drainage", "Safe for vegetables and herbs", "No chemical additives", "Odourless and easy to use"],
    howToUse: [
      { step: "1", title: "Mix into soil", desc: "Add 1–2 handfuls per pot or 1 kg per sq. metre of garden bed." },
      { step: "2", title: "Water lightly", desc: "Water after application to help nutrients seep into the soil." },
      { step: "3", title: "Repeat monthly", desc: "Re-apply once a month during the growing season for best results." },
    ],
    price: 299, originalPrice: 399,
    badge: "Best Seller",
    category: "fertilizers",
    images: [
      "https://i.pinimg.com/1200x/be/35/00/be3500059b0dc21b9fc51db357353594.jpg",
      "https://i.pinimg.com/1200x/72/4b/f5/724bf56f26d9a31b3f007decddd665f4.jpg",
    ],
    rating: 5, reviews: 241, weights: ["1 kg", "3 kg", "5 kg"],
    sku: "KO-FERT-001", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 12,
    name: "Neem Cake Powder",
    nameTa: "வேப்பம் பிண்ணாக்கு",
    subtitle: "1 kg — natural pest repellent",
    subtitleTa: "1 கிலோ — இயற்கை பூச்சி விரட்டி",
    description: "Cold-pressed neem cake powder that acts as both a fertiliser and a natural pesticide. Protects plants from soil-borne pests and nematodes while adding nitrogen and organic matter.",
    highlights: ["Dual action: fertiliser + pest repellent", "Controls soil-borne pests and nematodes", "100% natural — no chemicals", "Rich in nitrogen", "Safe for all plants"],
    howToUse: [
      { step: "1", title: "Mix into soil", desc: "Add 1 teaspoon per pot and mix into the top 2 inches of soil." },
      { step: "2", title: "Apply at planting", desc: "Mix into soil before transplanting for best pest protection." },
      { step: "3", title: "Re-apply monthly", desc: "Sprinkle around the base of plants once a month." },
    ],
    price: 199,
    badge: "Organic",
    category: "fertilizers",
    images: [
      "https://i.pinimg.com/736x/d1/22/44/d12244fad4a3f0349e1c4cbcf63d5156.jpg",
    ],
    rating: 5, reviews: 158, weights: ["500 g", "1 kg", "2 kg"],
    sku: "KO-FERT-002", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 13,
    name: "Seaweed Liquid",
    nameTa: "கடற்பாசி திரவ உரம்",
    subtitle: "500ml concentrate",
    subtitleTa: "500 மிலி செறிவூட்டல்",
    description: "Premium seaweed extract liquid fertiliser that promotes root growth, flowering, and fruiting. Mix with water and apply as a foliar spray or soil drench. Excellent for fruiting plants like tomatoes.",
    highlights: ["Promotes root growth and flowering", "Rich in natural plant hormones", "Increases fruit yield", "Apply as spray or soil drench", "Works on all flowering plants"],
    howToUse: [
      { step: "1", title: "Dilute", desc: "Mix 2ml per litre of water." },
      { step: "2", title: "Apply", desc: "Spray on leaves or water into the soil. Apply in the morning." },
      { step: "3", title: "Frequency", desc: "Apply every 2–3 weeks during flowering and fruiting stage." },
    ],
    price: 249,
    badge: "New",
    category: "fertilizers",
    images: [
      "https://i.pinimg.com/736x/72/2a/a1/722aa11f11409ccbeee874dc6280b0a8.jpg",
    ],
    rating: 4, reviews: 29, weights: ["250 ml", "500 ml", "1 litre"],
    sku: "KO-FERT-003", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 14,
    name: "Bone Meal Powder",
    nameTa: "எலும்பு மாவு",
    subtitle: "2 kg — slow release",
    subtitleTa: "2 கிலோ — மெதுவாக வெளியிடும்",
    description: "Steamed bone meal powder rich in phosphorus and calcium. Excellent for root development and flowering. Slow-release formula feeds plants over several months.",
    highlights: ["High phosphorus content", "Promotes strong root development", "Slow-release — feeds for months", "Ideal for flowering and fruiting plants", "100% natural"],
    howToUse: [
      { step: "1", title: "Mix at planting", desc: "Add 2 tablespoons per pot when preparing the soil." },
      { step: "2", title: "Top-dress", desc: "Sprinkle on the soil surface and water in once every 2 months." },
      { step: "3", title: "For flowering", desc: "Apply extra dose when flower buds appear." },
    ],
    price: 179, originalPrice: 219,
    badge: "Sale",
    category: "fertilizers",
    images: [
      "https://i.pinimg.com/1200x/86/b1/48/86b14800e16d4829c6b2b349f69f1c3e.jpg",
    ],
    rating: 4, reviews: 67, weights: ["1 kg", "2 kg", "5 kg"],
    sku: "KO-FERT-004", inStock: true, deliveryDays: "2–4",
  },

  // ── Grow Bags ──────────────────────────────────────────────────────────────
  {
    id: 15,
    name: "Fabric Grow Bag",
    nameTa: "துணி வளர் பை",
    subtitle: "15 litre — set of 3",
    subtitleTa: "15 லிட்டர் — 3 பைகள் செட்",
    description: "Heavy-duty breathable fabric grow bags that promote healthy root pruning and excellent drainage. Far superior to plastic pots for most vegetables. Lightweight and foldable for easy storage.",
    highlights: ["Air-prunes roots for healthier plants", "Superior drainage — no root rot", "Lightweight and foldable", "Durable — lasts 5+ seasons", "Set of 3 bags"],
    howToUse: [
      { step: "1", title: "Fill with mix", desc: "Fill with cocopeat and vermicompost mix. Leave 2 inches from the top." },
      { step: "2", title: "Plant", desc: "Plant one large vegetable (tomato, chilli) or 3–4 herbs per bag." },
      { step: "3", title: "Water frequently", desc: "Fabric bags dry out faster. Check moisture every day in summer." },
    ],
    price: 299,
    badge: "Best Seller",
    category: "grow-bags",
    images: [
      "https://i.pinimg.com/1200x/a4/61/56/a461565688e8b1221d11d73979b3d0ce.jpg",
    ],
    rating: 5, reviews: 189, weights: ["5 litre (set of 3)", "15 litre (set of 3)", "25 litre (set of 3)"],
    sku: "KO-GROW-001", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 16,
    name: "Large Grow Bag",
    nameTa: "பெரிய வளர் பை",
    subtitle: "40 litre — heavy duty",
    subtitleTa: "40 லிட்டர் — கனமான வேலை",
    description: "Extra-large 40-litre fabric grow bag for big plants like brinjal, pumpkin, and large tomato varieties. Reinforced stitching and sturdy handles for easy moving.",
    highlights: ["40 litre capacity", "Reinforced handles", "Extra-durable 300gsm fabric", "Ideal for large vegetables", "Air-pruning for healthy roots"],
    howToUse: [
      { step: "1", title: "Position first", desc: "Decide on placement before filling — 40L of soil is heavy to move." },
      { step: "2", title: "Fill and firm", desc: "Fill with growing mix and firm gently. Leave 3 inches from top." },
      { step: "3", title: "Water deeply", desc: "Water until it drains from the base. Check moisture every 1–2 days." },
    ],
    price: 199,
    badge: "Popular",
    category: "grow-bags",
    images: [
      "https://i.pinimg.com/1200x/51/5f/c5/515fc53eafa9926968371714013a012a.jpg",
    ],
    rating: 4, reviews: 74, weights: ["40 litre (1 bag)", "40 litre (set of 2)"],
    sku: "KO-GROW-002", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 17,
    name: "UV Grow Bag Kit",
    nameTa: "UV வளர் பை கிட்",
    subtitle: "Set of 5 — UV resistant",
    subtitleTa: "5 பைகள் — சூரிய ஒளி எதிர்ப்பு",
    description: "UV-stabilised grow bags that won't degrade in harsh Tamil Nadu sunlight. Includes 5 bags in mixed sizes — ideal for a starter terrace garden.",
    highlights: ["UV stabilised — won't fade or crack", "Set of 5 in mixed sizes", "Suitable for direct sunlight", "BPA-free material", "Drainage holes pre-punched"],
    howToUse: [
      { step: "1", title: "Choose size for plant", desc: "Use smaller bags for herbs, larger for vegetables." },
      { step: "2", title: "Prepare mix", desc: "Fill with cocopeat + vermicompost (70:30 ratio)." },
      { step: "3", title: "Place in full sun", desc: "These bags are designed to handle direct sunlight all day." },
    ],
    price: 449,
    badge: "New",
    category: "grow-bags",
    images: [
      "https://i.pinimg.com/736x/72/90/2f/72902f4246351e4c77adbe858d3ab985.jpg",
    ],
    rating: 4, reviews: 22, weights: ["Set of 5 (mixed sizes)"],
    sku: "KO-GROW-003", inStock: true, deliveryDays: "2–4",
  },

  // ── Coco Peats ─────────────────────────────────────────────────────────────
  {
    id: 18,
    name: "Coco Peat Block",
    nameTa: "தேங்காய் நார் தொகுதி",
    subtitle: "650g — expands to 8L",
    subtitleTa: "650 கிராம் — 8 லிட்டராக விரிவடையும்",
    description: "Premium compressed coco peat block made from 100% coconut husk fibre. Add water and it expands to 8 litres of light, airy growing medium. Perfect for seed starting and mixing with soil.",
    highlights: ["650g block expands to 8 litres", "100% natural coconut fibre", "Excellent water retention", "Promotes root growth", "pH neutral — suitable for all plants"],
    howToUse: [
      { step: "1", title: "Place in bucket", desc: "Put the block in a large bucket or tub." },
      { step: "2", title: "Add water", desc: "Pour 4–5 litres of water over the block. Wait 15 minutes." },
      { step: "3", title: "Fluff and use", desc: "Break up the expanded coco peat and use directly in pots or mix with soil." },
    ],
    price: 129,
    badge: "Best Seller",
    category: "coco-peats",
    images: [
      "https://i.pinimg.com/736x/fa/01/f6/fa01f6c32e72a41ab8d2a33b01f7f3d5.jpg",
    ],
    rating: 5, reviews: 312, weights: ["650g block (8L)", "1.5kg block (16L)"],
    sku: "KO-COCO-001", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 19,
    name: "Coco Peat Powder",
    nameTa: "தேங்காய் நார் தூள்",
    subtitle: "5 kg loose bag",
    subtitleTa: "5 கிலோ தளர்வான பை",
    description: "Ready-to-use loose coco peat powder — no soaking required. Pre-washed and buffered. Ideal for large-scale mixing for grow bags, raised beds, and seed trays.",
    highlights: ["Ready to use — no soaking needed", "Pre-washed and buffered", "Low EC — won't burn roots", "5 kg bag (approx. 40L when hydrated)", "Suitable for all potting mixes"],
    howToUse: [
      { step: "1", title: "Measure out", desc: "Use 2 parts coco peat to 1 part vermicompost for a balanced mix." },
      { step: "2", title: "Mix and moisten", desc: "Mix thoroughly and moisten slightly before filling pots." },
      { step: "3", title: "Plant and water", desc: "Plant directly and water well to settle the mix." },
    ],
    price: 249,
    badge: "Popular",
    category: "coco-peats",
    images: [
      "https://i.pinimg.com/1200x/f8/ab/07/f8ab077b2b7f66ae9eaa25c13949f33a.jpg",
    ],
    rating: 4, reviews: 98, weights: ["2 kg", "5 kg", "10 kg"],
    sku: "KO-COCO-002", inStock: true, deliveryDays: "2–4",
  },

  // ── Tools ──────────────────────────────────────────────────────────────────
  {
    id: 20,
    name: "Garden Water Spray",
    nameTa: "தோட்ட நீர் தெளிப்பான்",
    subtitle: "1L — adjustable nozzle",
    subtitleTa: "1 லிட்டர் — சரிசெய்யக்கூடிய முனை",
    description: "1-litre hand pressure sprayer with an adjustable nozzle for mist to jet settings. Perfect for watering seedlings, applying liquid fertiliser, and foliar spraying.",
    highlights: ["1 litre capacity", "Adjustable nozzle — mist to jet", "Comfortable grip handle", "Durable HDPE plastic", "Easy to clean"],
    howToUse: [
      { step: "1", title: "Fill with water", desc: "Fill to the max line. Do not overfill." },
      { step: "2", title: "Pump to pressurise", desc: "Pump the handle 5–6 times to build pressure." },
      { step: "3", title: "Adjust nozzle", desc: "Turn nozzle to set the spray pattern before use." },
    ],
    price: 199,
    badge: "Popular",
    category: "tools",
    images: [
      "https://i.pinimg.com/1200x/02/80/9f/02809f23f5f5be3c2785ba9053646e6b.jpg",
    ],
    rating: 4, reviews: 85, weights: ["1 litre", "2 litre"],
    sku: "KO-TOOL-001", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 21,
    name: "Trowel & Fork Set",
    nameTa: "தோட்ட கருவி செட்",
    subtitle: "Stainless steel — ergonomic",
    subtitleTa: "துருப்பிடிக்காத எஃகு — கை சேர்ந்த வடிவம்",
    description: "Heavy-duty stainless steel trowel and hand fork with ergonomic rubber handles. Rust-resistant and comfortable to use. Essential tools for transplanting, weeding, and loosening soil.",
    highlights: ["Stainless steel — rust-resistant", "Ergonomic rubber grip", "Depth markings on trowel", "Set of 2 tools", "Suitable for pots and raised beds"],
    howToUse: [
      { step: "1", title: "Trowel for planting", desc: "Use the trowel for digging planting holes and transplanting seedlings." },
      { step: "2", title: "Fork for aerating", desc: "Use the hand fork to loosen compacted soil around plants." },
      { step: "3", title: "Clean after use", desc: "Rinse with water and dry before storing to prevent rust." },
    ],
    price: 349,
    badge: "New",
    category: "tools",
    images: [
      "https://i.pinimg.com/1200x/2b/30/b0/2b30b0f697a33bedc92bdef6032acc5f.jpg",
    ],
    rating: 5, reviews: 47, weights: ["Trowel + Fork set"],
    sku: "KO-TOOL-002", inStock: true, deliveryDays: "2–4",
  },
  {
    id: 22,
    name: "Plant Starter Kit",
    nameTa: "தாவர தொடக்க கிட்",
    subtitle: "Everything to begin",
    subtitleTa: "தொடங்க தேவையான அனைத்தும்",
    description: "The complete beginner gardening kit. Includes a coco peat block, two seed packs (tomato + coriander), a small bag of vermicompost, a trowel, and a spray bottle. Everything you need in one box.",
    highlights: ["Coco peat block (650g)", "Tomato + coriander seed packs", "Vermicompost (500g)", "Mini trowel", "Spray bottle (500ml)"],
    howToUse: [
      { step: "1", title: "Set up your growing mix", desc: "Expand the coco peat block, mix with vermicompost." },
      { step: "2", title: "Sow your seeds", desc: "Follow the instructions on each seed pack." },
      { step: "3", title: "Water and wait", desc: "Mist daily with the spray bottle. Seeds germinate in 7–14 days." },
    ],
    price: 599,
    badge: "Best Seller",
    category: "tools",
    images: [
      "https://i.pinimg.com/736x/27/79/d5/2779d56409a05da505c5a3e828ed4368.jpg",
    ],
    rating: 5, reviews: 134, weights: ["Standard kit"],
    sku: "KO-TOOL-003", inStock: true, deliveryDays: "2–4",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all" || !category) return products;
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(id: number, limit = 4): Product[] {
  const product = getProductById(id);
  if (!product) return [];
  return products
    .filter((p) => p.id !== id && p.category === product.category)
    .slice(0, limit);
}