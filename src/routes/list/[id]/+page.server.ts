import { getList } from '$lib/server/database';
import { error } from '@sveltejs/kit';
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
    list
  };
}) satisfies PageServerLoad;
