import Reservation from "../models/booking_model.js";

const createReservation = async (req, res) => {
    try {
        console.log("Data received:", req.body); // Log the JSON you just showed me
        
        const { name, email, phone, date, time, notes } = req.body;
        
        const booking = new Reservation({ name, email, phone, date, time, notes });
        const savedBooking = await booking.save();

        return res.status(201).json({
            success: true,
            message: "Reservation created",
            reservation: savedBooking
        });
    } catch (err) {
        console.error("The actual error is:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}

const getAllReservation = async (req, res) => {
    try {
        const bookings = await Reservation.find();
        return res.status(200).json({
            success: true,
            bookings:bookings
        });
    } catch (err) {
        console.error("The actual error is:", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve data",
            error: err.message
        });
    }
}

const deleteReservation = async (req, res) => {
    try {
        const {id} = req.params;
        await Reservation.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Reservation deleted"
        })
    } catch (err) {
        console.error("The actual error is:", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to delete reservation",
            error: err.message
        });
    }
}

export { createReservation, getAllReservation, deleteReservation };