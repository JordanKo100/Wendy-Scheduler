import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 100 },
        email: { type: String, required: true, lowercase: true, trim: true, index: true },
        phone: { type: String, required: true, trim: true },
        date: { type: String, required: true, index: true }, // YYYY-MM-DD
        time: { type: String, required: true },
        notes: { type: String, default: '', maxlength: 500 },
    },
    { timestamps: true },
);

// Prevent double-booking the same slot.
reservationSchema.index({ date: 1, time: 1 }, { unique: true });

export default mongoose.model('Reservation', reservationSchema);