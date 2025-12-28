import { recipeSchema } from '$lib/schemas/recipe';
import { getAllIngredients } from '$lib/server/database/ingredient';
import { deleteRecipe, getRecipe, updateRecipe } from '$lib/server/database/recipe';
import { getAllUnits } from '$lib/server/database/unit';
import { parseErrors } from '$lib/server/helpers';
import { Prisma } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    throw error(404, 'Recipe not found');
  }

  return {
    recipe,
    units: (await getAllUnits()).map((unit) => unit.name),
    ingredients: (await getAllIngredients()).map((ingredient) => ingredient.name)
  };
}) satisfies PageServerLoad;

export const actions = {
  save: async ({ params, request }) => {
    const formData = await request.formData();
    const result = recipeSchema.safeParse(formData);

    if (!result.success) {
      return fail(400, {
        data: createData(formData),
        errors: parseErrors(result)
      });
    }

    try {
      const recipe = await updateRecipe(params.id, result.data);
      redirect(303, `/recipe/${recipe?.id}`);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002' &&
        e.meta?.modelName === 'Recipe'
      ) {
        return fail(400, {
          success: false,
          data: createData(formData),
          errors: {
            title: 'There is already a recipe with this title'
          } as { [x: string]: string }
        });
      }
      throw e;
    }
  },
  delete: async ({ params }) => {
    await deleteRecipe(params.id);
    redirect(303, '/recipe');
  }
};

function createData(formData: FormData) {
  return {
    title: formData.get('title')?.toString(),
    description: formData.get('description')?.toString(),
    servings: formData.get('servings')?.toString(),
    time: formData.get('time')?.toString(),
    amounts: formData.getAll('amount').map((x) => x.toString()),
    units: formData.getAll('unit').map((x) => x.toString()),
    ingredients: formData.getAll('ingredient').map((x) => x.toString()),
    steps: formData.getAll('step').map((x) => x.toString()),
    stepIds: formData.getAll('stepId').map((x) => x.toString())
  };
}
