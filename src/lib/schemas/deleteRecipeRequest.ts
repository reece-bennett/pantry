import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const deleteRecipeRequestSchema = zfd.formData({
  id: zfd.text()
});

export type DeleteRecipeRequest = z.infer<typeof deleteRecipeRequestSchema>;
