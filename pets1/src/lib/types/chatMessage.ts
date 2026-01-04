import { z } from "zod";

export const ChatMessageSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  senderId: z.string(),
  content: z.string(),
  type: z.enum(["text", "image", "file", "system"]).default("text"),
  readBy: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
  timestamp: z.date().default(() => new Date()),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;