import type { PageServerLoad } from './$types';
import { recipes } from '../data';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
  const recipe = recipes.find((recipe) => recipe.slug === params.slug);

  if (!recipe) {
    throw error(404);
  }

  return {
    recipe
  };
}) satisfies PageServerLoad;
