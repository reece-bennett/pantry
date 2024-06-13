import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const listSubmissionSchema = zfd.formData(
  z.record(z.string(), zfd.numeric(z.number().min(0)))
);

export type ListSubmission = z.infer<typeof listSubmissionSchema>;
