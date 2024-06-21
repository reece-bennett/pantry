import { listSubmissionSchema } from '$lib/schemas/listSubmission';
import { createList } from '$lib/server/database/list';
import { getAllRecipes } from '$lib/server/database/recipe';
import { parseErrors } from '$lib/server/helpers';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {
    recipes: await getAllRecipes()
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const result = listSubmissionSchema.safeParse(formData);

    if (!result.success) {
      const returnThing = {
        success: false,
        data: createData(formData),
        errors: parseErrors(result)
      };
      return fail(400, returnThing);
    }

    const list = await createList(result.data);

    redirect(303, `/list/${list.id}`);
  }
};

function createData(formData: FormData) {
  return new Map(
    Array.from(formData.entries()).map(([key, value]) => [key, parseInt(value.toString())])
  );
}
