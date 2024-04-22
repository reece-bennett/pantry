import { PrismaClient } from '@prisma/client';
import data from "./seed_data.json" assert { type: "json" };

const prisma = new PrismaClient();

async function main() {
  for (const recipe of data) {
    const result = await prisma.recipe.create({
      data: recipe
    });
    console.log(result);
  }
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
