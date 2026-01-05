import express from 'express'
import { createReservation, deleteReservation, getAllReservation } from '../controllers/booking_controller.js'

const router = express.Router();

router.post('/create', createReservation);
router.get('/get', getAllReservation);
router.delete('/delete/:id', deleteReservation);

export default router;