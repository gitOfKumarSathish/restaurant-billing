import z from "zod";

export const createMenuItemSchema = z.object({
    itemName: z.string().min(1, "Item name is required"),
    itemPrice: z.number().positive("Item price must be a positive number"),
    availabilityStatus: z.boolean({ required_error: "Availability status is required" }),
    description: z.string().optional()
});

export const updateMenuItemSchema = z.object({
    itemName: z.string().min(1, "Item name is required").optional(),
    itemPrice: z.number({
        required_error: "Item price is required",
        invalid_type_error: "Item price must be a number"
    }).positive("Item price must be a positive number").optional(),
    availabilityStatus: z.boolean().optional(),
    description: z.string().optional()
});