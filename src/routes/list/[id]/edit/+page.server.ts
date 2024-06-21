import { listSubmissionSchema } from '$lib/schemas/listSubmission';
import { getList, updateList } from '$lib/server/database/list';
import { getAllRecipes } from '$lib/server/database/recipe';
import { parseErrors } from '$lib/server/helpers';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  if (isNaN(Number(params.id))) {
    throw error(404);
  }

  const list = await getList(Number(params.id));

  if (!list) {
    throw error(404);
  }

  return {
    recipes: await getAllRecipes(),
    list
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ params, request }) => {
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

    await updateList(Number(params.id), result.data);

    redirect(303, `/list/${params.id}`);
  }
};

function createData(formData: FormData) {
  return new Map(
    Array.from(formData.entries()).map(([key, value]) => [key, parseInt(value.toString())])
  );
}
