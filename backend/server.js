import express from 'express'

import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import userRoutes from './routes/user.js'
import expenseRoutes from './routes/expense.js'
import razorPayment from './routes/razorpay.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv' 

dotenv.config()

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'trusted-cdn.com'],
        },
    },
    
    })
);


app.use('/user',userRoutes)
app.use('/expense',expenseRoutes)
app.use('/payment',razorPayment)

// database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
   // useUnifiedTopology: true,
    
})
.then(()=>console.log("DB Connection Successfully"))
.catch((err)=>{
    console.log(err)
})




app.listen(8800, ()=>{
    console.log("server is running!")
})