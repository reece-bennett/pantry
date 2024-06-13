import { getAllLists } from '$lib/server/database';
import type { PageServerLoad } from './$types'

export const load = (async () => {
  return {
    lists: await getAllLists()
  }
}) satisfies PageServerLoad;