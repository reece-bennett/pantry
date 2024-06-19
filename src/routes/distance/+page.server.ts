import { getAllIngredients } from '$lib/server/database';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {
    ingredients: (await getAllIngredients()).map((ingredient) => ingredient.name)
  };
}) satisfies PageServerLoad;
