import type { Recipe } from '$lib/schemas/recipe';
import prisma from '../prisma';

export function getAllRecipes() {
  return prisma.recipe.findMany();
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
      steps: {
        orderBy: {
          id: 'asc'
        }
      }
    }
  });
}

export async function createRecipe(recipe: Recipe) {
  return prisma.recipe.create({
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
}
export async function updateRecipe(id: string, recipe: Recipe) {
  return prisma.$transaction(async (tx) => {
    // Delete deleted steps
    await tx.step.deleteMany({
      where: {
        recipeId: id,
        id: {
          notIn: recipe.stepId.filter((stepId) => stepId !== undefined)
        }
      }
    });

    // Update the rest of the recipe
    return tx.recipe.update({
      where: {
        id
      },
      data: {
        name: recipe.title,
        description: recipe.description,
        servings: recipe.servings,
        time: recipe.time,
        ingredients: {
          upsert: recipe.ingredient.map((ingredient, i) => ({
            where: {
              recipeId_ingredientName_unitName: {
                recipeId: id,
                ingredientName: ingredient,
                unitName: recipe.unit[i]
              }
            },
            update: {
              amount: recipe.amount[i]
            },
            create: {
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
            }
          })),
          deleteMany: {
            NOT: {
              OR: recipe.ingredient.map((ingredient, i) => ({
                ingredientName: ingredient,
                unitName: recipe.unit[i]
              }))
            }
          }
        },
        steps: {
          upsert: recipe.step.map((step, i) => ({
            where: {
              id: recipe.stepId[i] ?? -1
            },
            update: {
              content: step
            },
            create: {
              content: step
            }
          }))
        }
      }
    });
  });
}

export function deleteRecipe(id: string) {
  return prisma.recipe.delete({
    where: {
      id
    }
  });
}

function createSlug(title: string): string {
  return title.toLowerCase().replace(/\W/gm, '-');
}
