import express from 'express'
import { loginRequest, signUpRequest, checkUserRequest } from '../controllers/auth_controller.js'

const router = express.Router();

router.post('/login', loginRequest);
router.post('/signup', signUpRequest);
router.post('/check-user', checkUserRequest);

export default router;