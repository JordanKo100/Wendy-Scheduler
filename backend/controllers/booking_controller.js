import Reservation from "../models/booking_model.js";

const createReservation = async (req, res) => {
    try {        
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
        const bookings = await Reservation.find().sort({
            date: 1,
            time: 1
        });
        return res.status(200).json({
            success: true,
            bookings: bookings
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

const checkAvailability = async (req, res) => {
    try {
        const booked = await Reservation.find({ date: req.params.date }).select('time');
        const times = booked.map(b => b.time); // Returns e.g. ["10:00 AM", "1:30 PM"]
        res.json({ success: true, takenSlots: times });
    } catch (err) {
        res.status(500).json({ success: false });
    }
}

const updateReservation = async (req, res) => {
    try {
        const {id} = req.params;

        const {name, time, date} = req.body;
        const updateData = { 
            name: name,
            date: date,
            time: time
        };
        await Reservation.findByIdAndUpdate(id, updateData)
        res.json({success: true, message: "Successfully Updated Appointment"});
    } catch (err) {
        res.status(500).json({success: false});
    }
}

export { 
    createReservation, 
    getAllReservation, 
    deleteReservation,
    checkAvailability,
    updateReservation
};