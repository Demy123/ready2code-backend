import express from 'express';
import { createOrder, verifyPayment, getSubscriptionStatus } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/status', protect, getSubscriptionStatus);

export default router;
