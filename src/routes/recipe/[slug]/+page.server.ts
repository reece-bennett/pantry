import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getRecipe } from "$lib/server/database";

export const load = (async ({ params }) => {
  const recipe = await getRecipe(params.slug);

  if (!recipe) {
    throw error(404);
  }

  return {
    recipe
  };
}) satisfies PageServerLoad;
