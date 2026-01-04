import { z } from "zod";

export const ChatGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  members: z.array(z.string()), // User IDs
  type: z.enum(["clinic", "trainer", "store", "support"]),
  lastMessage: z.string().optional(),
  lastMessageAt: z.date().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type ChatGroup = z.infer<typeof ChatGroupSchema>;