import { zfd } from 'zod-form-data';
import type { PageServerLoad } from './$types';
import type { ZodIssue, z } from 'zod';
import { fail } from '@sveltejs/kit';
import parseGousto from '$lib/server/scraper/gousto';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const result = schema.safeParse(formData);

    if (!result.success) {
      return fail(400, {
        success: false,
        errors: parseErrors(result)
      });
    }

    if (result.data.url.includes('gousto.co.uk')) {
      const recipe = await parseGousto(result.data.url);
      return {
        success: true,
        data: {
          url: result.data.url,
          recipe
        }
      };
    } else {
      return fail(400, {
        success: false,
        data: {
          url: result.data.url,
          recipe: null
        },
        errors: {
          url: 'Site not supported'
        }
      });
    }
  }
};

const schema = zfd.formData({
  url: zfd.text()
});

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
