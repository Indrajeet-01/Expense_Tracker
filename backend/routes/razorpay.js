import express from 'express'
import { createOrder, paymentStatus } from '../controllers/razorpay.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/createOrder',authMiddleware, createOrder)
router.post('/paymentSuccess', paymentStatus)

export default router