import type { ListSubmission } from '$lib/schemas/listSubmission';
import { newListSelectRecipeSchema } from '$lib/schemas/newListSelectRecipe.ts';
import { addRecipe, createList, getList, updateList } from '$lib/server/database/list';
import { getAllRecipes, getRecipe } from '$lib/server/database/recipe';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  return {
    listId: params.id,
    recipes: await getAllRecipes()
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const result = newListSelectRecipeSchema.safeParse(formData);

    if (!result.success) {
      return error(400);
    }

    // const cookieValue = cookies.get('selectedRecipeIds');
    // const selectedRecipeIds: Recipe['id'][] = cookieValue ? JSON.parse(cookieValue) : [];
    // selectedRecipeIds.push(result.data.id);
    // cookies.set('selectedRecipeIds', JSON.stringify(selectedRecipeIds), { path: '/' });

    const selectedRecipe = await getRecipe(result.data.id);

    if (!selectedRecipe) {
      return error(400);
    }

    const list = params.id
      ? await addRecipe(Number(params.id), result.data.id, selectedRecipe.servings)
      : await createList({ [result.data.id]: selectedRecipe.servings });

    redirect(303, `/list/${list.id}/edit`);
  }
} satisfies Actions;
