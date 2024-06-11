import type { PageServerLoad } from './$types';
import { getAllRecipes } from "$lib/server/database";

export const load = (async () => {
  return {
    recipes: await getAllRecipes()
  };
}) satisfies PageServerLoad;
