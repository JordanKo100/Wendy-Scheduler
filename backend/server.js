// 1. Add .js extensions to local files
import bookingRoutes from './routes/booking_routes.js'; 
import authRoutes from './routes/auth_routes.js';
import connectDB from './config/db_mongo.js';

// 2. Convert 'require' to 'import' for packages
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/reservations', bookingRoutes);
app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log("✅ Server running on port 5000"));