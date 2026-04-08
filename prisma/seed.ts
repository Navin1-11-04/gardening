import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default admin
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

  // Create categories
  const categories = [
    { name: "Seeds", nameTa: "விதைகள்", slug: "seeds" },
    { name: "Grow Bags", nameTa: "வளர் பைகள்", slug: "grow-bags" },
    { name: "Fertilizers", nameTa: "உரங்கள்", slug: "fertilizers" },
    { name: "Coco Peats", nameTa: "தென்னை சணல்", slug: "coco-peats" },
    { name: "Pots", nameTa: "குடுவைகள்", slug: "pots" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        nameTa: cat.nameTa,
        slug: cat.slug,
      },
    });
  }

  console.log("✅ Created categories");

  console.log("✅ Database seeded successfully!");
  console.log("📝 Admin Credentials:");
  console.log("   Email: admin@kavin-organics.com");
  console.log("   Password: admin123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
