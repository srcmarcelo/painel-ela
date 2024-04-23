import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const scoreSchema = z.object({
  id: z.string(),
  year: z.number(),
  type: z.string(),
  student_id: z.string(),
  class_id: z.string(),
  score: z.array(z.number() || z.undefined()),
});

export type Score = z.infer<typeof scoreSchema>;
