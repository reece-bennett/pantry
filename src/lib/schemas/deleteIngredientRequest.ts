import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const deleteIngredientRequestSchema = zfd
  .formData({
    ingredientToDelete: zfd.text(),
    replacementIngredient: zfd.text(z.string().refine((val) => val))
  })
  .refine((data) => data.ingredientToDelete !== data.replacementIngredient, {
    message: 'The replacement ingredient must be different to the ingredient being deleted',
    path: ['replacementIngredient']
  });

export type DeleteIngredientRequest = z.infer<typeof deleteIngredientRequestSchema>;
