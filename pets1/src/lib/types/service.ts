import { z } from "zod";

export const ServiceSchema = z.object({
  id: z.string(),
  clinicId: z.string(),
  
  // Service Info
  name: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  
  // Service Details
  serviceType: z.enum([
    "vaccination",
    "checkup", 
    "surgery", 
    "dental", 
    "grooming", 
    "emergency",
    "diagnostic", 
    "wellness", 
    "other"
  ]),
  
  // Pet-Specific Fields
  suitableFor: z.array(z.enum(["dog", "cat", "bird", "small_animal", "reptile", "all"])).default(["all"]),
  ageRange: z.enum(["puppy/kitten", "adult", "senior", "all"]).default("all"),
  
  // Business Details
  duration: z.number().min(15, "Minimum duration is 15 minutes")
                     .max(240, "Maximum duration is 4 hours"),
  price: z.number().min(0, "Price cannot be negative"),
  
  // Status
  isActive: z.boolean().default(true),
  
  // Timestamps
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type Service = z.infer<typeof ServiceSchema>;

// Form Schema
export const ServiceFormSchema = ServiceSchema.omit({
  id: true,
  clinicId: true,
  createdAt: true,
  updatedAt: true,
});

export type ServiceFormData = z.infer<typeof ServiceFormSchema>;