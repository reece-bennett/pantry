import { recipeSchema } from '$lib/schemas/recipe';
import { createRecipe } from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import { z, type ZodIssue } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const result = recipeSchema.safeParse(formData);

    if (!result.success) {
      const returnThing = {
        success: false,
        data: createData(formData),
        errors: parseErrors(result)
      };
      return fail(400, returnThing);
    }

    await createRecipe(result.data);

    redirect(303, '/recipe');
  }
};

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
    title: formData.get('title')?.toString(),
    description: formData.get('description')?.toString(),
    amounts: formData.getAll('amount').map((x) => x.toString()),
    units: formData.getAll('unit').map((x) => x.toString()),
    ingredients: formData.getAll('ingredient').map((x) => x.toString()),
    steps: formData.getAll('step').map((x) => x.toString())
  };
}
