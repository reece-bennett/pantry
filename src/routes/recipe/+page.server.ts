import { getAllRecipes } from "$lib/server/database/recipe";
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {
    recipes: await getAllRecipes()
  };
}) satisfies PageServerLoad;
