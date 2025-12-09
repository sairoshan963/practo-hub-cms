import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.user.upsert({
    where: { email: "roshan.neelam@gamyam.co" },
    update: {},
    create: {
      firstName: "Sai Roshan",
      lastName: "Neelam",
      email: "roshan.neelam@gamyam.co",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Super Admin created successfully!");
  console.log("Email: roshan.neelam@gamyam.co");
  console.log("Password: Admin@123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("Seed error:", err);
    prisma.$disconnect();
    process.exit(1);
  });
