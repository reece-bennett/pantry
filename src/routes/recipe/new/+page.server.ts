import { recipeSchema } from '$lib/schemas/recipe';
import { getAllIngredients } from '$lib/server/database/ingredient';
import { createRecipe } from '$lib/server/database/recipe';
import { getAllUnits } from '$lib/server/database/unit';
import { parseErrors } from '$lib/server/helpers';
import parseGousto from '$lib/server/scraper/gousto';
import { Prisma } from '@prisma/client';
import { fail, redirect, type Actions } from '@sveltejs/kit';
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

    try {
      const recipe = await createRecipe(result.data);
      redirect(303, `/recipe/${recipe?.id}`);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002' &&
        e.meta?.modelName === 'Recipe'
      ) {
        return fail(400, {
          success: false,
          data: createData(formData),
          errors: {
            title: 'There is already a recipe with this title'
          } as { [x: string]: string }
        });
      }
      throw e;
    }
  }
} satisfies Actions;

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
