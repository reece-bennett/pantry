import type { Recipe } from '$lib/schemas/recipe';
import prisma from './prisma';

const slugRegex = /\W/gm;

export function getAllRecipes() {
  return prisma.recipe.findMany();
}

export function getAllUnits() {
  return prisma.unit.findMany();
}

export function getAllIngredients() {
  return prisma.ingredient.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

export function getRecipe(slug: string) {
  return prisma.recipe.findFirst({
    where: {
      slug: {
        equals: slug
      }
    },
    include: {
      ingredients: {
        include: {
          ingredient: true,
          unit: true
        }
      },
      steps: true
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
          unit: {
            connect: {
              name: recipe.unit[i]
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
        create: recipe.step.map((step) => ({ content: step }))
      }
    }
  });
}

function createSlug(title: string): string {
  return title.toLowerCase().replace(slugRegex, '-');
}
