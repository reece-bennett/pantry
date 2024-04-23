import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const recipeSchema = zfd.formData({
  title: zfd.text(),
  description: zfd.text(),
  amount: zfd.repeatable(z.array(zfd.numeric())),
  unit: zfd.repeatable(z.array(zfd.text())),
  ingredient: zfd.repeatable(z.array(zfd.text())),
  step: zfd.repeatable(z.array(zfd.text()))
});

export type Recipe = z.infer<typeof recipeSchema>;
