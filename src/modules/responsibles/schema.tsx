import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const responsibleSchema = z.object({
  id: z.string(),
  code: z.number(),
  name: z.string(),
  cpf: z.string(),
  phone: z.string(),
  email: z.string(),
  responsible_type: z.string(),
  children: z.array(z.string()),
});

export type Responsible = z.infer<typeof responsibleSchema>;
