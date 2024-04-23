import type { Recipe } from '$lib/schemas/recipe';
import prisma from './prisma';

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

export function createRecipe(recipe: Recipe) {
  return prisma.recipe.create({
    data: {
      name: recipe.title,
      description: recipe.description,
      servings: 0,
      slug: createSlug(recipe.title),
      time: 0,
      ingredients: {
        create: recipe.ingredient.map((ingredient, i) => ({
          amount: recipe.amount[i],
          unit: recipe.unit[i],
          ingredient
        }))
      }
    }
  });
}

function createSlug(title: string): string {
  return title.toLowerCase().replace(slugRegex, '-');
}
