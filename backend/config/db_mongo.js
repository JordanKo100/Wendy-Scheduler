import mongoose from 'mongoose';
import 'dotenv/config'; // This is the ESM way to load .env variables

const connectDB = async () => {
    // It is good practice to handle connection errors
    mongoose.connection.on('connected', () => {
        console.log("✅ Connected to MongoDB");
    });

    mongoose.connection.on('error', (err) => {
        console.log("❌ MongoDB Connection Error: " + err);
    });

    try {
        // Ensure your MONGODB_URI in .env doesn't end with a slash
        await mongoose.connect(`${process.env.MONGODB_URI}/form`);
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;