import prisma from '../prisma';

export function getAllUnits() {
  return prisma.unit.findMany();
}
