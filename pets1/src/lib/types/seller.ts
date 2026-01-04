import { z } from "zod";

export const SellerSchema = z.object({
  id: z.string(),
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string(),
  email: z.string().email(),
  website: z.string().url().optional(),
  categories: z.array(z.enum([
    "food", 
    "toys", 
    "accessories", 
    "health", 
    "grooming",
    "bedding"
  ])).default([]),
  isActive: z.boolean().default(true),
  products: z.array(z.string()).default([]), // Product IDs
  rating: z.number().min(0).max(5).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type Seller = z.infer<typeof SellerSchema>;