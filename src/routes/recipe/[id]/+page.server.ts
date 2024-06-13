import { deleteRecipe, getRecipe } from '$lib/server/database';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { deleteRecipeRequestSchema } from '$lib/schemas/deleteRecipeRequest';

export const load = (async ({ params }) => {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    throw error(404);
  }

  return {
    recipe
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const result = deleteRecipeRequestSchema.safeParse(formData);

    if (!result.success) {
      return error(400);
    }

    await deleteRecipe(result.data.id);

    redirect(303, '/recipe');
  }
};
