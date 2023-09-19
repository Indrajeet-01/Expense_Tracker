import { db } from "../db.js";
import {sendResetCodeEmail} from '../resetPassword/sendEmail.js'

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

// reset password
export const sendResetPasswordCode = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists in the database
        const selectQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(selectQuery, [email], async (err, userData) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        // If no user found with the provided email
        if (userData.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userData[0];
        
        // Remove any existing reset code for this user
        const deleteQuery = 'DELETE FROM reset_codes WHERE user_id = ?';
        db.query(deleteQuery, [user.id], async (deleteErr) => {
            if (deleteErr) {
            return res.status(500).json({ message: 'Database error' });
            }

            // Generate a new reset code
            const code = generateCode(5);

            // Save the reset code in the database
            const insertQuery = 'INSERT INTO reset_codes (code, user_id) VALUES (?, ?)';
            db.query(insertQuery, [code, user.id], async (insertErr) => {
                if (insertErr) {
                    return res.status(500).json({ message: 'Database error' });
                }

                // Send the reset code via email
                sendResetCodeEmail(user.email, user.name, code);

                return res.status(200).json({
                    message: 'Email reset code has been sent to your email',
                });
            });
        });
    });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

  // Helper function to generate a reset code (you can use a library for this)
function generateCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}

// update password
export const updatePassword = (req, res) => {
    const { email, code, newPassword } = req.body;

    // Check if the provided email and reset code match an entry in the reset_codes table
    const selectQuery = 'SELECT u.id, u.name, u.email, c.code FROM users u JOIN reset_codes c ON u.id = c.user_id WHERE u.email = ? AND c.code = ?';
    db.query(selectQuery, [email, code], (err, codeData) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

      // If no matching reset code found
        if (codeData.length === 0) {
            return res.status(404).json({ message: 'Invalid reset code' });
        }

        const resetCode = codeData[0];

        // Check if the reset code has expired (you may need to adjust the comparison logic)
        const currentTime = new Date();
        const codeExpirationTime = new Date(resetCode.created_at);
        codeExpirationTime.setHours(codeExpirationTime.getHours() + 1); // Code expires in 1 hour

        if (currentTime > codeExpirationTime) {
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);

       // Update the user's password in the users table
        const updatePasswordQuery = 'UPDATE users SET password = ? WHERE email = ?';
        db.query(updatePasswordQuery, [hash, email], (updateErr) => {
            if (updateErr) {
                return res.status(500).json({ message: 'Database error' });
            }

           // Delete the used reset code from the reset_codes table
            const deleteCodeQuery = 'DELETE FROM reset_codes WHERE id = ?';
            db.query(deleteCodeQuery, [resetCode.id], (deleteErr) => {
                if (deleteErr) {
                    return res.status(500).json({ message: 'Database error' });
                }

                return res.status(200).json({ message: 'Password updated successfully' });
            });
        });
    });
};
