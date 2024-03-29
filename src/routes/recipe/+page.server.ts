import type { PageServerLoad } from './$types';
import { getRecipes } from "$lib/server/database";

export const load = (async () => {
  return {
    recipes: getRecipes()
  };
}) satisfies PageServerLoad;
