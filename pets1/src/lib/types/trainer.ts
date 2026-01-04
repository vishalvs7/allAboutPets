import { z } from "zod";

export const TrainerSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Trainer name must be at least 2 characters"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  specialization: z.array(z.enum([
    "obedience", 
    "agility", 
    "behavior", 
    "puppy", 
    "service_dog",
    "therapy_dog"
  ])).default([]),
  experience: z.number().min(0, "Experience cannot be negative"),
  certifications: z.array(z.string()).default([]),
  location: z.string(),
  phone: z.string(),
  email: z.string().email(),
  isActive: z.boolean().default(true),
  sessions: z.array(z.string()).default([]), // Session IDs
  rating: z.number().min(0).max(5).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type Trainer = z.infer<typeof TrainerSchema>;