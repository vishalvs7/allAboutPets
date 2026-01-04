import { z } from "zod";

export const AppointmentSchema = z.object({
  id: z.string(),
  clinicId: z.string(),
  serviceId: z.string(),
  petOwnerId: z.string(),
  
  // Pet Information
  petName: z.string().min(1, "Pet name is required"),
  petType: z.enum(["dog", "cat", "bird", "rabbit", "hamster", "reptile", "other"]),
  petBreed: z.string().optional(),
  petAge: z.number().min(0, "Age cannot be negative"),
  petWeight: z.number().min(0, "Weight cannot be negative").optional(),
  
  // Appointment Details
  appointmentDate: z.date(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
  notes: z.string().optional(),
  
  // Contact Info
  ownerName: z.string(),
  ownerPhone: z.string(),
  ownerEmail: z.string().email(),
  
  // Timestamps
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

// Form Schema (for creating/updating appointments)
export const AppointmentFormSchema = AppointmentSchema.omit({
  id: true,
  clinicId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
});

export type AppointmentFormData = z.infer<typeof AppointmentFormSchema>;