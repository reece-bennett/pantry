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
