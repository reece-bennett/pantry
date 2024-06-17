import { recipeSchema } from '$lib/schemas/recipe';
import { createRecipe, getAllIngredients, getAllUnits } from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import { z, type ZodIssue } from 'zod';
import type { PageServerLoad } from './$types';
import parseGousto from '$lib/server/scraper/gousto';
import { zfd } from 'zod-form-data';

export const load = (async () => {
  return {
    units: await getAllUnits(),
    ingredients: await getAllIngredients()
  };
}) satisfies PageServerLoad;

const schema = zfd.formData({
  url: zfd.text()
});

// interface Data {
//   url: string | undefined;
//   title: string | undefined;
//   description: string | undefined;
//   amounts: string[];
//   units: string[];
//   ingredients: string[];
//   steps: string[];
// }

// interface OkResponse {
//   success: true;
//   data: Data;
// }

// interface ErrorResponse {
//   success: false;
//   data: Data;
//   errors: {
//     [x: string]: string;
//   };
// }

// type FormResponse = OkResponse | ErrorResponse;

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

    if (result.data.url.includes('gousto.co.uk')) {
      const recipe = await parseGousto(result.data.url);
      return {
        success: true,
        data: {
          url: result.data.url,
          title: recipe.name,
          description: recipe.description,
          amounts: recipe.ingredients.map((ingredient) => ingredient.amount.toString()),
          units: recipe.ingredients.map((ingredient) => ingredient.unit),
          ingredients: recipe.ingredients.map((ingredient) => ingredient.name),
          steps: recipe.steps
        }
      };
    } else {
      return fail(400, {
        success: false,
        data: createData(formData),
        errors: {
          url: 'Site not supported'
        } as { [x: string]: string }
      });
    }
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
    url: formData.get('url')?.toString(),
    title: formData.get('title')?.toString(),
    description: formData.get('description')?.toString(),
    amounts: formData.getAll('amount').map((x) => x.toString()),
    units: formData.getAll('unit').map((x) => x.toString()),
    ingredients: formData.getAll('ingredient').map((x) => x.toString()),
    steps: formData.getAll('step').map((x) => x.toString())
  };
}
