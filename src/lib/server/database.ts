import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slugRegex = /\W/gm;

export function getRecipes() {
  return prisma.recipe.findMany();
}

export function getRecipe(slug: string) {
  return prisma.recipe.findFirst({
    where: {
      slug: {
        equals: slug
      }
    },
    include: {
      ingredients: true
    }
  });
}

export function createRecipe(title: string, description: string) {
  // recipes.push({
  //   slug: createSlug(title),
  //   title,
  //   description
  // })
}

function createSlug(title: string): string {
  return title.toLowerCase().replace(slugRegex, '-');
}
