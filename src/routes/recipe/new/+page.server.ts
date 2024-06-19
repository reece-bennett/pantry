import { recipeSchema } from '$lib/schemas/recipe';
import { createRecipe, getAllIngredients, getAllUnits } from '$lib/server/database';
import parseGousto from '$lib/server/scraper/gousto';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { z, type ZodIssue } from 'zod';
import { zfd } from 'zod-form-data';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {
    units: (await getAllUnits()).map((unit) => unit.name),
    ingredients: (await getAllIngredients()).map((ingredient) => ingredient.name)
  };
}) satisfies PageServerLoad;

const schema = zfd.formData({
  url: zfd.text()
});

export const actions = {
  url: async ({ request }) => {
    const formData = await request.formData();
    const result = schema.safeParse(formData);

    if (!result.success) {
      return fail(400, {
        success: false,
        data: createData(formData),
        errors: parseErrors(result)
      });
    }

    if (!result.data.url.includes('gousto.co.uk')) {
      return fail(400, {
        success: false,
        data: createData(formData),
        errors: {
          url: 'Site not supported'
        } as { [x: string]: string }
      });
    }

    const recipe = await parseGousto(result.data.url);
    return {
      success: true,
      data: {
        url: result.data.url,
        title: recipe.name,
        description: recipe.description,
        servings: recipe.servings,
        time: recipe.time,
        amounts: recipe.ingredients.map((ingredient) => ingredient.amount.toString()),
        units: recipe.ingredients.map((ingredient) => ingredient.unit),
        ingredients: recipe.ingredients.map((ingredient) => ingredient.name),
        originals: recipe.ingredients.map((ingredient) => ingredient.original),
        steps: recipe.steps
      }
    };
  },
  submit: async ({ request }) => {
    const formData = await request.formData();
    const result = recipeSchema.safeParse(formData);

    if (!result.success) {
      return fail(400, {
        success: false,
        data: createData(formData),
        errors: parseErrors(result)
      });
    }

    const recipe = await createRecipe(result.data);

    redirect(303, `/recipe/${recipe?.id}`);
  }
} satisfies Actions;

function parseErrors(result: z.SafeParseError<FormData>) {
  const flattened = result.error.flatten((issue: ZodIssue) => ({
    message: issue.message,
    path: issue.path
  })).fieldErrors;
  const errors: { [x: string]: string } = {};
  for (const [k, v] of Object.entries(flattened)) {
    for (const { message, path } of v) {
      errors[k + (path[1] ?? '')] = message;
    }
  }
  return errors;
}

function createData(formData: FormData) {
  return {
    url: formData.get('url')?.toString(),
    title: formData.get('title')?.toString(),
    description: formData.get('description')?.toString(),
    servings: formData.get('servings')?.toString(),
    time: formData.get('time')?.toString(),
    amounts: formData.getAll('amount').map((x) => x.toString()),
    units: formData.getAll('unit').map((x) => x.toString()),
    ingredients: formData.getAll('ingredient').map((x) => x.toString()),
    originals: formData.getAll('original').map((x) => x.toString()),
    steps: formData.getAll('step').map((x) => x.toString())
  };
}
