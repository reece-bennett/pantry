import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const deleteListRequestSchema = zfd.formData({
  id: zfd.numeric(z.number().min(0))
});

export type DeleteListRequest = z.infer<typeof deleteListRequestSchema>;
