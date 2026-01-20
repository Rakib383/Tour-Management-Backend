import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string({ message: "name must be string" })
        .min(2, { message: "name too short" })
        .max(50, { message: "name too long" }),
    email: z
        .string()
        .email(),
    password: z
        .string()
        .min(8).regex(/^(?=.*[A-Z])/, { message: "password must contain at least 1 uppercase letter" })
        .regex(/^(?=.*[\W_])/, { message: "password must contain at least 1 special character" })
        .regex(/^(?=.*\d)/, { message: "password must contain at least 1 number" }),
    phone: z.string().optional(),
    address: z.string().optional()
}

)


export const updateUserZodSchema = z.object({
    name: z
        .string({ message: "name must be string" })
        .min(2, { message: "name too short" })
        .max(50, { message: "name too long" })
        .optional(),
    password: z
        .string()
        .min(8).regex(/^(?=.*[A-Z])/, { message: "password must contain at least 1 uppercase letter" })
        .regex(/^(?=.*[\W_])/, { message: "password must contain at least 1 special character" })
        .regex(/^(?=.*\d)/, { message: "password must contain at least 1 number" })
        .optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z
        .enum(Object.values(Role))
        .optional(),
    isActive: z
        .enum(Object.values(IsActive))
        .optional(),
    isDeleted: z
        .boolean({ message: "isDeleted must be true/false" })
        .optional(),
    isVerified: z
        .boolean({ message: "isVerified must be true/false" })
        .optional()
}

)