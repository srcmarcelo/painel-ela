import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const classSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  grade: z.string(),
  period: z.string(),
  teacher: z.string(),
  type: z.enum(["elementary", "infant"]),
});

export const attendanceSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  date: z.string(),
  attended_students: z.array(z.string()),
  absent_students: z.array(z.string()),
  class_id: z.string(),
});

export const absenceSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  student_id: z.string(),
  class_id: z.string(),
  justified: z.boolean(),
  date: z.string(),
});

export type Class = z.infer<typeof classSchema>;

export type Attendance = z.infer<typeof attendanceSchema>;

export type Absence = z.infer<typeof absenceSchema>;
