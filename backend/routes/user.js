import express from 'express'
import {register,login,sendResetPasswordCode,updatePassword, logout, getLeaderboard, isUserPremium} from '../controllers/user.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/register',register)
router.post('/login', login)
router.get('/leaderBoard',authMiddleware, getLeaderboard)
router.get('/isUserPremium',authMiddleware, isUserPremium)
router.post('/logout', logout)
router.post('/sendEmail', sendResetPasswordCode)
router.post('/updatePassword', updatePassword)


export default router