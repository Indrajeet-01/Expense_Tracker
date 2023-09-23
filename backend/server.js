import express from 'express'
import { db } from './db.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import userRoutes from './routes/user.js'
import expenseRoutes from './routes/expense.js'
import razorPayment from './routes/razorpay.js'

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


db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database')
        return;
    }
    console.log('Connected to the database' )
})

app.listen(8800, ()=>{
    console.log("server is running!")
})