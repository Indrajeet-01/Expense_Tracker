import express from 'express'
import {register,login,sendResetPasswordCode,updatePassword} from '../controllers/user.js'

const router = express.Router()

router.post('/register',register)
router.post('/login', login)
router.post('/sendEmail',sendResetPasswordCode)
router.post('/updatePassword',updatePassword)


export default router