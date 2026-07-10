import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Oil change", defaultIntervalMiles: 5000, defaultIntervalMonths: 6 },
  { name: "Tire rotation", defaultIntervalMiles: 5000, defaultIntervalMonths: null },
  { name: "Brake service", defaultIntervalMiles: null, defaultIntervalMonths: null },
  { name: "Brake fluid service", defaultIntervalMiles: 40000, defaultIntervalMonths: null },
  { name: "Battery replacement", defaultIntervalMiles: null, defaultIntervalMonths: 48 },
  { name: "Transmission service", defaultIntervalMiles: 60000, defaultIntervalMonths: null },
  { name: "Spark plugs", defaultIntervalMiles: 60000, defaultIntervalMonths: null },
  { name: "Transfer case service", defaultIntervalMiles: 60000, defaultIntervalMonths: null },
  { name: "Front/Rear differential service", defaultIntervalMiles: 60000, defaultIntervalMonths: null },
  { name: "Coolant flush", defaultIntervalMiles: 100000, defaultIntervalMonths: 24 },
  { name: "Air filter", defaultIntervalMiles: 30000, defaultIntervalMonths: null },
  { name: "Registration", defaultIntervalMiles: null, defaultIntervalMonths: 12 },
  { name: "Other", defaultIntervalMiles: null, defaultIntervalMonths: null },
];

async function main() {
  for (const category of categories) {
    await prisma.maintenanceCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
  console.log(`Seeded ${categories.length} maintenance categories.`);
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
