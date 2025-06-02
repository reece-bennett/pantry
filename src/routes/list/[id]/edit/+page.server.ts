import { listSubmissionSchema } from '$lib/schemas/listSubmission';
import { getList, updateList } from '$lib/server/database/list';
import { parseErrors } from '$lib/server/helpers';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, RouteParams } from './$types';

export const load = (async ({ params }) => {
  if (isNaN(Number(params.id))) {
    throw error(404);
  }

  const list = await getList(Number(params.id));

  if (!list) {
    throw error(404);
  }

  return {
    list
  };
}) satisfies PageServerLoad;

export const actions = {
  save: async ({ params, request }) => {
    const error = await save(params, request);
    if (error) {
      return error;
    }

    redirect(303, `/list/${params.id}`);
  },
  addRecipe: async ({ params, request }) => {
    const error = await save(params, request);
    if (error) {
      return error;
    }

    redirect(303, `/list/${params.id}/select-recipe`);
  }
};

async function save(params: RouteParams, request: Request) {
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

  const filteredRecipes = filterRecord(result.data, (portions) => portions > 0);

  await updateList(Number(params.id), filteredRecipes);
}

function createData(formData: FormData) {
  return new Map(
    Array.from(formData.entries()).map(([key, value]) => [key, parseInt(value.toString())])
  );
}

function filterRecord<K extends string, V>(
  obj: Record<K, V>,
  fn: (value: V) => boolean
): Record<K, V> {
  const newObj = {} as Record<K, V>;
  for (const key in obj) {
    const value = obj[key];
    if (fn(value)) newObj[key] = value;
  }
  return newObj;
}
