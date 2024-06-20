import { listSubmissionSchema } from '$lib/schemas/listSubmission';
import { getAllRecipes, getList, updateList } from '$lib/server/database';
import { error, fail, redirect } from '@sveltejs/kit';
import type { z, ZodIssue } from 'zod';
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
  return new Map(
    Array.from(formData.entries()).map(([key, value]) => [key, parseInt(value.toString())])
  );
}