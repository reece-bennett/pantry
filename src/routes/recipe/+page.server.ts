import type { PageServerLoad } from './$types';
import { recipes } from "./data";

export const load = (async () => {
  return {
    recipes
  };
}) satisfies PageServerLoad;
