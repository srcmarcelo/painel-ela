import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const classSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  grade: z.string(),
  period: z.string(),
  teacher: z.string(),
});

export type Class = z.infer<typeof classSchema>;
