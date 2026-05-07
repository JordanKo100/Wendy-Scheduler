import { z } from 'zod';

// HH:MM 24h or "H:MM AM/PM"
const timeRegex = /^(?:\d{1,2}:\d{2}(?:\s?[AP]M)?|\d{2}:\d{2})$/i;

const dateString = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
    .refine((s) => !Number.isNaN(Date.parse(s)), 'Invalid date');

export const createReservationSchema = z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().email().toLowerCase(),
    phone: z.string().regex(/^[\d\s()+-]{7,20}$/),
    date: dateString,
    time: z.string().regex(timeRegex, 'Invalid time'),
    notes: z.string().max(500).optional().default(''),
});

export const updateReservationSchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    phone: z.string().regex(/^[\d\s()+-]{7,20}$/).optional(),
    date: dateString.optional(),
    time: z.string().regex(timeRegex).optional(),
});

export const mongoIdParam = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id'),
});

export const dateParam = z.object({
    date: dateString,
});