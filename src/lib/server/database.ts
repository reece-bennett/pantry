import type { ListSubmission } from '$lib/schemas/listSubmission';
import type { Recipe } from '$lib/schemas/recipe';
import { Prisma } from '@prisma/client';
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

export function getAllLists() {
  return prisma.list.findMany();
}

export function getList(id: number) {
  return prisma.list.findUnique({
    where: {
      id
    },
    include: {
      meals: {
        include: {
          recipe: {
            include: {
              ingredients: true
            }
          }
        }
      }
    }
  });
}

export function deleteList(id: number) {
  return prisma.list.delete({
    where: {
      id
    }
  });
}

export function getRecipe(id: string) {
  return prisma.recipe.findUnique({
    where: {
      id
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

export async function createRecipe(recipe: Recipe) {
  try {
    return await prisma.recipe.create({
      data: {
        id: createSlug(recipe.title),
        name: recipe.title,
        description: recipe.description,
        servings: recipe.servings,
        time: recipe.time,
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        // TODO: Return this error back up to the UI (duplicate title)
        console.log(`There is a unique constraint violation on ${e.meta?.modelName}`);
        return;
      }
    }
    throw e;
  }
}

export function deleteRecipe(id: string) {
  return prisma.recipe.delete({
    where: {
      id
    }
  });
}

export function createList(listSubmission: ListSubmission) {
  return prisma.list.create({
    data: {
      meals: {
        create: Object.entries(listSubmission).map(([id, servings]) => ({
          recipe: {
            connect: {
              id
            }
          },
          servings
        }))
      }
    }
  });
}

function createSlug(title: string): string {
  return title.toLowerCase().replace(slugRegex, '-');
}
