import express from 'express'
import { db } from './db.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import userRoutes from './routes/user.js'

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use('/user',userRoutes)


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