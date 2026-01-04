import { z } from "zod";

export const ClinicSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Clinic name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string(),
  email: z.string().email(),
  website: z.string().url().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  services: z.array(z.string()).default([]), // Service IDs
  veterinarians: z.array(z.string()).default([]), // User IDs
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type Clinic = z.infer<typeof ClinicSchema>;