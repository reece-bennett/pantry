import type { ListSubmission } from '$lib/schemas/listSubmission';
import prisma from '../prisma';

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
