import { getAllIngredients, updateIngredients } from '$lib/server/database';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {
    ingredients: (await getAllIngredients()).map((ingredient) => ingredient.name)
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    const changedIngredients = Array.from(formData).filter(
      ([oldValue, newValue]) => oldValue !== newValue
    ) as [string, string][];

    await updateIngredients(changedIngredients);
  }
};
