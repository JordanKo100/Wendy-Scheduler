import mongoose from 'mongoose';
import { config } from './index.js';

export default async function connectMongo() {
    mongoose.connection.on('connected', () =>
        console.log('✅ MongoDB connected'),
    );
    mongoose.connection.on('error', (err) =>
        console.error('❌ MongoDB error:', err.message),
    );

    try {
        await mongoose.connect(`${config.mongo.uri}/${config.mongo.db}`);
    } catch (err) {
        console.error('Could not connect to MongoDB:', err.message);
        process.exit(1);
    }
}