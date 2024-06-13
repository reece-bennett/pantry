import { createList, getAllRecipes } from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import { z, type ZodIssue } from 'zod';
import type { PageServerLoad } from './$types';
import { listSubmissionSchema } from '$lib/schemas/listSubmission';

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

    await createList(result.data);

    redirect(303, '/list');
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
