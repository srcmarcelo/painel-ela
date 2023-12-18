import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const studentSchema = z.object({
  id: z.string(),
  code: z.number(),
  name: z.string(),
  date_of_birth: z.date(),
  class: z.string(),
  father: z.string(),
  mother: z.string(),
})

export type Student = z.infer<typeof studentSchema>