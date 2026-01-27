import z from "zod";

export const createOrderSchema = z.object({
    items: z.array(z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid item ID"),
        quantity: z.number().int().positive("Quantity must be a positive number"),
    }).strict()).min(1, "At least one item is required"),
    // totalPrice: z.number().positive("Total price must be a positive number")
}).strict();