import { parseErrors } from '$lib/server/helpers';
import parseGousto from '$lib/server/scraper/gousto';
import { fail } from '@sveltejs/kit';
import { zfd } from 'zod-form-data';
import type { PageServerLoad } from './$types';

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
