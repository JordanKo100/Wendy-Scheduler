import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    name: {type: String, required:true},
    email: {type: String, required:true},
    phone: {type: String, required:true},
    date: {type: Date, required:true},
    time: {type: String, required:true},
    notes: {type: String, required:false},
    expireAt: {
        type: Date,
        expires: 0 // MongoDB deletes the doc when this exact time is reached
    }
}, { timestamps: true });

// Middleware to calculate the exact expiration time before saving
reservationSchema.pre('save', async function() {
    // Note: We removed 'next' from the arguments
    if (this.date && this.time) {
        // 1. Start with the date
        const expiration = new Date(this.date);
        
        // 2. Extract hours and minutes
        const [hours, minutes] = this.time.split(':');
        
        // 3. Set the expiration (e.g., +1 hour)
        expiration.setHours(parseInt(hours) + 1, parseInt(minutes), 0);
        
        this.expireAt = expiration;
        
        console.log("Auto-calculated expiry:", this.expireAt);
    }
    // No next() needed when using async!
});

export default mongoose.model("Reservation", reservationSchema);