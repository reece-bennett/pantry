import prisma from '../prisma';

export function getAllIngredients() {
  return prisma.ingredient.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

export function updateIngredients(changedIngredients: [string, string][]) {
  return prisma.$transaction(
    changedIngredients.map(([oldName, newName]) =>
      prisma.ingredient.update({
        where: { name: oldName },
        data: { name: newName }
      })
    )
  );
}

export function replaceIngredient(ingredientToDelete: string, replacementIngredient: string) {
  return prisma.$transaction([
    prisma.recipeIngredient.updateMany({
      where: {
        ingredientName: ingredientToDelete
      },
      data: {
        ingredientName: replacementIngredient
      }
    }),
    prisma.ingredient.delete({
      where: {
        name: ingredientToDelete
      }
    })
  ]);
}
