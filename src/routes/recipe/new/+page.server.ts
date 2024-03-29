import type { PageServerLoad } from './$types';
import { createRecipe } from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title')?.toString();
    const description = data.get('description')?.toString();
    if (!title || title === '') {
      return fail(422, {
        data: Object.fromEntries(data.entries()),
        error: 'Title must have a value'
      });
    }
    if (!description || description === '') {
      return fail(422, {
        data: Object.fromEntries(data.entries()),
        error: 'Description must have a value'
      });
    }
    createRecipe(title, description);
    redirect(303, '/recipe');
  }
};
