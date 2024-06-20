import { deleteListRequestSchema } from '$lib/schemas/deleteListRequest';
import { deleteList, getList } from '$lib/server/database/list';
import { error, redirect } from '@sveltejs/kit';
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

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const result = deleteListRequestSchema.safeParse(formData);

    if (!result.success) {
      return error(400);
    }

    await deleteList(result.data.id);

    redirect(303, '/list');
  }
};
