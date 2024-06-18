import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const recipeSchema = zfd.formData({
  title: zfd.text(),
  description: zfd.text(),
  servings: zfd.numeric(),
  time: zfd.numeric(),
  amount: zfd.repeatable(z.array(zfd.numeric())),
  unit: zfd.repeatable(z.array(zfd.text())),
  ingredient: zfd.repeatable(
    z.array(zfd.text()).superRefine((items, ctx) => {
      // Adapted from https://github.com/colinhacks/zod/discussions/2316#discussioncomment-8488396
      const uniqueValues = new Map<string, number>();
      items.forEach((item, i) => {
        const firstSeenIndex = uniqueValues.get(item);
        if (firstSeenIndex !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'must be unique',
            path: [i]
          });
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'must be unique',
            path: [firstSeenIndex]
          });
        } else {
          uniqueValues.set(item, i);
        }
      });
    })
  ),
  original: zfd.repeatable(z.array(zfd.text())),
  step: zfd.repeatable(z.array(zfd.text()))
});

export type Recipe = z.infer<typeof recipeSchema>;
