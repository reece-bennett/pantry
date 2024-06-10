import { PrismaClient } from '@prisma/client';
import data from "./seed_data.json" assert { type: "json" };

const prisma = new PrismaClient();

async function main() {
  const unitResult = await prisma.unit.createMany({
    data: [
      { name: 'g' },
      { name: 'x' },
      { name: 'tbsp' },
      { name: 'tsp' },
      { name: 'ml' }
    ]
  });
  console.log(unitResult);

  const ingredientResult = await prisma.ingredient.createMany({
    data: [
      { name: "Apple" },
      { name: "Beef stock mix" },
      { name: "Bulgur wheat" },
      { name: "Cheddar cheese" },
      { name: "Chipotle paste" },
      { name: "Chopped dates" },
      { name: "Courgette" },
      { name: "Couscous" },
      { name: "Garlic cloves" },
      { name: "Ground allspice" },
      { name: "Ground cumin" },
      { name: "Lamb mince" },
      { name: "Pistachio nuts" },
      { name: "Pork mince" },
      { name: "Ras el hanout" },
      { name: "Red onion" },
      { name: "Red wine vinegar" },
      { name: "Tomato paste" }
    ]
  });
  console.log(ingredientResult);

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
