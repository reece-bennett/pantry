import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const newListSelectRecipeSchema = zfd.formData({
  id: zfd.text()
});

export type NewListSelectRecipe = z.infer<typeof newListSelectRecipeSchema>;
