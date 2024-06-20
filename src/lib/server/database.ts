import type { ListSubmission } from '$lib/schemas/listSubmission';
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

export function updateList(id: number, listSubmission: ListSubmission) {
  return prisma.list.update({
    where: {
      id
    },
    data: {
      meals: {
        upsert: Object.entries(listSubmission).map(([recipeId, servings]) => ({
          where: {
            recipeId_listId: {
              listId: id,
              recipeId
            }
          },
          update: {
            servings
          },
          create: {
            recipe: {
              connect: {
                id: recipeId
              }
            },
            servings
          }
        })),
        deleteMany: {
          recipeId: {
            notIn: Object.keys(listSubmission)
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
