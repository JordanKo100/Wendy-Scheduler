import Reservation from '../models/booking_model.js';

// Customers can only create reservations under their own email.
export async function createReservation(req, res) {
    try {
        const { name, email, phone, date, time, notes } = req.body;

        if (req.user.role !== 'admin' && email !== req.user.email) {
            return res.status(403).json({ message: 'Cannot book for another user' });
        }

        const booking = await Reservation.create({ name, email, phone, date, time, notes });
        return res.status(201).json({ reservation: booking });
    } catch (err) {
        console.error('createReservation:', err);
        return res.status(500).json({ message: 'Failed to create reservation' });
    }
}

// Admin-only.
export async function getAllReservations(_req, res) {
    try {
        const bookings = await Reservation.find().sort({ date: 1, time: 1 });
        return res.status(200).json({ bookings });
    } catch (err) {
        console.error('getAllReservations:', err);
        return res.status(500).json({ message: 'Failed to retrieve reservations' });
    }
}

// Customer can only read their own; admin can read anyone's.
export async function getReservationsByEmail(req, res) {
    try {
        const { email } = req.params;

        if (req.user.role !== 'admin' && email.toLowerCase() !== req.user.email) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const bookings = await Reservation.find({ email: email.toLowerCase() });
        return res.status(200).json({ bookings });
    } catch (err) {
        console.error('getReservationsByEmail:', err);
        return res.status(500).json({ message: 'Failed to retrieve reservations' });
    }
}

export async function deleteReservation(req, res) {
    try {
        const { id } = req.params;
        const booking = await Reservation.findById(id);
        if (!booking) return res.status(404).json({ message: 'Not found' });

        if (req.user.role !== 'admin' && booking.email !== req.user.email) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await booking.deleteOne();
        return res.status(204).end();
    } catch (err) {
        console.error('deleteReservation:', err);
        return res.status(500).json({ message: 'Failed to delete reservation' });
    }
}

export async function updateReservation(req, res) {
    try {
        const { id } = req.params;
        const booking = await Reservation.findById(id);
        if (!booking) return res.status(404).json({ message: 'Not found' });

        if (req.user.role !== 'admin' && booking.email !== req.user.email) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Only allow whitelisted fields.
        const { name, phone, date, time } = req.body;
        Object.assign(booking, {
            ...(name !== undefined && { name }),
            ...(phone !== undefined && { phone }),
            ...(date !== undefined && { date }),
            ...(time !== undefined && { time }),
        });
        await booking.save();

        return res.status(200).json({ reservation: booking });
    } catch (err) {
        console.error('updateReservation:', err);
        return res.status(500).json({ message: 'Failed to update reservation' });
    }
}

// Public endpoint — returns only time slots, no PII.
export async function checkAvailability(req, res) {
    try {
        const { date } = req.params;
        const booked = await Reservation.find({ date }).select('time -_id');
        const takenSlots = booked.map((b) => b.time);
        return res.status(200).json({ takenSlots });
    } catch (err) {
        console.error('checkAvailability:', err);
        return res.status(500).json({ message: 'Failed to check availability' });
    }
}