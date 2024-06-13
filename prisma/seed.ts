import { PrismaClient } from '@prisma/client';
import data from './seed_data.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
  await prisma.unit.createMany({
    data: [{ name: 'g' }, { name: 'x' }, { name: 'tbsp' }, { name: 'tsp' }, { name: 'ml' }],
    skipDuplicates: true
  });

  for (const recipe of data) {
    const result = await prisma.recipe.create({
      data: {
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        servings: recipe.servings,
        time: recipe.time,
        ingredients: {
          create: recipe.ingredients.map(({ amount, unit, ingredient }) => ({
            amount: amount,
            unit: {
              connect: {
                name: unit
              }
            },
            ingredient: {
              connectOrCreate: {
                where: {
                  name: ingredient
                },
                create: {
                  name: ingredient
                }
              }
            }
          }))
        },
        steps: {
          create: recipe.steps.map((content) => ({ content }))
        }
      }
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
