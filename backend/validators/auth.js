import { z } from 'zod';

const password = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long');

const phone = z
    .string()
    .regex(/^[\d\s()+-]{7,20}$/, 'Invalid phone number');

const name = z.string().trim().min(1).max(50);

export const loginSchema = z.object({
    email: z.string().email().toLowerCase(),
    password: z.string().min(1),
});

export const signupSchema = z.object({
    firstName: name,
    lastName: name,
    email: z.string().email().toLowerCase(),
    phone,
    password,
});