import express from 'express'
import { 
    checkAvailability, 
    createReservation, 
    deleteReservation, 
    getAllReservation, 
    updateReservation
} from '../controllers/booking_controller.js'

const router = express.Router();

router.post('/create', createReservation);
router.get('/get-all', getAllReservation);
router.delete('/delete/:id', deleteReservation);
router.get('/check-availability/:date', checkAvailability);
router.patch('/update/:id', updateReservation);

export default router;