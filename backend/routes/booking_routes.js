import express from 'express';
import {
    createReservation,
    getAllReservations,
    getReservationsByEmail,
    deleteReservation,
    updateReservation,
    checkAvailability,
} from '../controllers/booking_controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
    createReservationSchema,
    updateReservationSchema,
    mongoIdParam,
    dateParam,
} from '../validators/booking.js';

const router = express.Router();

// Public — returns taken time slots only, no PII.
router.get('/check-availability/:date', validate(dateParam, 'params'), checkAvailability);

// Authenticated users (ownership enforced in controller).
router.post('/create', requireAuth, validate(createReservationSchema), createReservation);
router.get('/get-email/:email', requireAuth, getReservationsByEmail);
router.patch(
    '/update/:id',
    requireAuth,
    validate(mongoIdParam, 'params'),
    validate(updateReservationSchema),
    updateReservation,
);
router.delete('/delete/:id', requireAuth, validate(mongoIdParam, 'params'), deleteReservation);

// Admin-only.
router.get('/get-all', requireAuth, requireAdmin, getAllReservations);

export default router;