import { type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  preload: async ({ request }) => {
    const formData = await request.formData();
    const values = formData.get('values')?.toString().split(',');
    return {
      data: values
    };
  },
  submit: async ({ request }) => {
    const formData = await request.formData();
    return {
      message: 'Submitted',
      data: formData.getAll('row') as string[]
    }
  }
} satisfies Actions;
