/*
  Warnings:

  - The primary key for the `RecipeIngredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `ingredient` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `RecipeIngredient` table. All the data in the column will be lost.
  - Added the required column `ingredientId` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" RENAME CONSTRAINT "recipes_pk" TO "Recipe_pkey";

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "recipe_ingredients_pk",
DROP COLUMN "id",
DROP COLUMN "ingredient",
DROP COLUMN "unit",
ADD COLUMN     "ingredientId" INTEGER NOT NULL,
ADD COLUMN     "unitId" INTEGER NOT NULL,
ADD CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("recipeId", "ingredientId", "unitId");

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
