import express from 'express'
import { addExpense, getExpense} from '../controllers/expense.js'
import {authMiddleware} from '../middleware/auth.js'

const router = express.Router()

router.post('/addExpense', authMiddleware, addExpense)
router.get('/displayExpenses', authMiddleware,getExpense)


export default router