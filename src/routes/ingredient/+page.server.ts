import { deleteIngredientRequestSchema } from '$lib/schemas/deleteIngredientRequest';
import {
  getAllIngredients,
  replaceIngredient,
  updateIngredients
} from '$lib/server/database/ingredient';
import { parseErrors } from '$lib/server/helpers';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {
    ingredients: (await getAllIngredients()).map((ingredient) => ingredient.name)
  };
}) satisfies PageServerLoad;

export const actions = {
  rename: async ({ request }) => {
    const formData = await request.formData();

    const changedIngredients = Array.from(formData).filter(
      ([oldValue, newValue]) => oldValue !== newValue
    ) as [string, string][];

    await updateIngredients(changedIngredients);
  },
  delete: async ({ request }) => {
    const formData = await request.formData();
    const result = deleteIngredientRequestSchema.safeParse(formData);

    if (!result.success) {
      return fail(400, {
        success: false,
        errors: parseErrors(result)
      });
    }

    await replaceIngredient(result.data.ingredientToDelete, result.data.replacementIngredient);

    return {
      success: true
    }
  }
};
