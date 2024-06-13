import { getRecipe } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    throw error(404);
  }

  return {
    recipe
  };
}) satisfies PageServerLoad;
