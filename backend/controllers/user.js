import { db } from "../db.js";

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// register new user
export const register = (req,res) => {
    const q = "SELECT * FROM users WHERE name = ? OR email = ? "

    db.query(q, [req.body.name, req.body.email], (err,data) => {
        if(err){
            return res.json(err)
        }
        if(data.length){
            return res.status(409).json("user already exist!")
        }

        // hash the password
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        const q = "INSERT INTO users(name,email,password) VALUES (?)"
        const values = [req.body.name, req.body.email, hash,]
        console.log(values)

        db.query(q, [values], (err,data) => {
            if(err){
                return res.json(err)
            }
            return res.status(200).json("user registered successfully")
        })
    })
}

// login user
export const login = (req,res) => {
    const q = "SELECT * FROM users WHERE name = ?"

    db.query(q, [req.body.name], (err, data) => {
        if(err){
            return res.json(err)
        }
        if(data.length == 0){
            res.status(404).json("User not found")
        }

        // check password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)

        if(!isPasswordCorrect) {
            return res.status(400).json("wrong username or password")
        }
        const token = jwt.sign({id:data[0].id}, "jwtkey")
        const {password, ...other} = data[0]

        res.cookie("access_token", token, {
            httpOnly:true,
        }).status(200).json(other)
    })
}