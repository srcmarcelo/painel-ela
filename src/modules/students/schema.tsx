import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const studentSchema = z.object({
  id: z.string(),
  code: z.number(),
  name: z.string(),
  date_of_birth: z.date(),
  class_id: z.string(),
  responsible_id: z.string(),
  mother_id: z.string(),
  father_id: z.string()
})

export type Student = z.infer<typeof studentSchema>