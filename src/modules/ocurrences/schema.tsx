import { z } from "zod"

export type occurrenceType = "good" | "bad" | "other";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const occurrenceSchema = z.object({
  id: z.string(),
  student_id: z.string(),
  date: z.string(),
  description: z.string(),
  type: z.union([z.literal("good"), z.literal("bad"), z.literal("other")]),
})

export type Occurrence = z.infer<typeof occurrenceSchema>
