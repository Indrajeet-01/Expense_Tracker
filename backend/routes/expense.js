import express from 'express'
import { addExpense, deleteExpense, getExpense} from '../controllers/expense.js'
import {authMiddleware} from '../middleware/auth.js'

const router = express.Router()

router.post('/addExpense',authMiddleware, addExpense)
router.get('/displayExpenses', authMiddleware,getExpense)
router.delete('/deleteExpense/:expenseId',authMiddleware,deleteExpense)


export default router