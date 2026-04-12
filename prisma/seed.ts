import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@kavin-organics.com" },
    update: {},
    create: {
      email: "admin@kavin-organics.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
      active: true,
    },
  });

  console.log("✅ Created admin:", admin.email);

  const categories = [
    { name: "Seeds", nameTa: "விதைகள்", slug: "seeds" },
    { name: "Grow Bags", nameTa: "வளர் பைகள்", slug: "grow-bags" },
    { name: "Fertilizers", nameTa: "உரங்கள்", slug: "fertilizers" },
    { name: "Coco Peats", nameTa: "தென்னை சணல்", slug: "coco-peats" },
    { name: "Pots", nameTa: "குடுவைகள்", slug: "pots" },
  ];

  await Promise.all(
    categories.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );

  console.log("✅ Created categories");

  console.log("\n🔥 Database seeded successfully!");
  console.log("📝 Admin Credentials:");
  console.log("   Email: admin@kavin-organics.com");
  console.log("   Password: admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });