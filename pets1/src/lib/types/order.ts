import { z } from "zod";

export const OrderSchema = z.object({
  id: z.string(),
  sellerId: z.string(),
  customerId: z.string(),
  
  // Order Items
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
    image: z.string().optional(),
  })),
  
  // Order Details
  totalAmount: z.number().min(0),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer", "cash_on_delivery"]),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
  
  // Shipping Info
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  
  // Contact Info
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  
  // Timestamps
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
  shippedAt: z.date().optional(),
  deliveredAt: z.date().optional(),
});

export type Order = z.infer<typeof OrderSchema>;