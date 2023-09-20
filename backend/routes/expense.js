import express from 'express'
import { addExpense} from '../controllers/expense.js'
import {authMiddleware} from '../middleware/auth.js'

const router = express.Router()

router.post('/addExpense', authMiddleware, addExpense)


export default router