import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  sellerId: z.string(),
  
  // Product Info
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  
  // Pet-Specific Fields
  category: z.enum(["food", "treats", "toys", "accessories", "health", "grooming", "bedding", "other"]),
  forPetType: z.array(z.enum(["dog", "cat", "bird", "small_animal", "fish", "reptile", "all"])).default(["all"]),
  petSize: z.enum(["xs", "s", "m", "l", "xl", "all"]).default("all"),
  lifeStage: z.enum(["puppy/kitten", "adult", "senior", "all"]).default("all"),
  
  // Inventory
  stockQuantity: z.number().min(0, "Stock cannot be negative"),
  sku: z.string().optional(),
  
  // Media
  images: z.array(z.string()).default([]),
  
  // Status
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  
  // Timestamps
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

// Form Schema
export const ProductFormSchema = ProductSchema.omit({
  id: true,
  sellerId: true,
  images: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  imageUrls: z.string().optional(),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;