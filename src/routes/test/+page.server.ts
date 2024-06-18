import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import parseGousto from '$lib/server/scraper/gousto';

export const load = (async ({ url }) => {
  const importUrl = url.searchParams.get('import');
  return {
    things: ['Thing 1', 'Thing 2'],
    importUrl,
    recipe: importUrl ? await parseGousto(importUrl) : null
  };
}) satisfies PageServerLoad;

export const actions = {
  url: async ({ request }) => {
    const formData = await request.formData();
    redirect(303, `?import=${formData.get('url')}`);
  }
} satisfies Actions;
