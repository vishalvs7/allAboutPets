import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["clinic", "trainer", "seller", "admin"]),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;