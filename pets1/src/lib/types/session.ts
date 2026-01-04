import { z } from "zod";

export const SessionSchema = z.object({
  id: z.string(),
  trainerId: z.string(),
  
  // Session Info
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  
  // Training Details
  sessionType: z.enum([
    "obedience",
    "agility", 
    "behavior", 
    "puppy", 
    "service_dog",
    "therapy_dog", 
    "socialization", 
    "advanced"
  ]),
  
  // Pet-Specific Fields
  suitableFor: z.array(z.enum(["dog", "cat", "other"])).default(["dog"]),
  skillLevel: z.enum(["beginner", "intermediate", "advanced", "all"]).default("beginner"),
  
  // Session Details
  duration: z.number().min(30, "Minimum duration is 30 minutes")
                     .max(180, "Maximum duration is 3 hours"),
  maxParticipants: z.number().min(1, "At least 1 participant")
                           .max(20, "Maximum 20 pets per session"),
  price: z.number().min(0, "Price cannot be negative"),
  
  // Scheduling
  sessionDate: z.date(),
  location: z.string().min(5, "Location must be at least 5 characters"),
  
  // Participants
  participants: z.array(z.string()).default([]), // Array of pet owner IDs
  currentParticipants: z.number().min(0).default(0),
  
  // Status
  isActive: z.boolean().default(true),
  
  // Timestamps
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type Session = z.infer<typeof SessionSchema>;

// Form Schema
export const SessionFormSchema = SessionSchema.omit({
  id: true,
  trainerId: true,
  participants: true,
  currentParticipants: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  sessionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
});

export type SessionFormData = z.infer<typeof SessionFormSchema>;