import { db } from "../db.js";
import {sendResetCodeEmail} from '../resetPassword/sendEmail.js'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import fs from 'fs'
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

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
        const responseData = {
            
            id: data[0].id,
            name: data[0].name,
            email: data[0].email,
            ispremium: data[0].ispremium,
            access_token: token,
        };

        res.cookie("access_token", token, {
            httpOnly:true,
        }).status(200).json(responseData)
        
    })
}

// get leader board by premium member
export const getLeaderboard = (req, res) => {
    const userId = req.user.id;

    // SQL query to check if the user is a premium member
    const premiumCheckQuery = 'SELECT ispremium FROM users WHERE id = ?';

    db.query(premiumCheckQuery, [userId], (premiumCheckErr, premiumCheckResults) => {
        if (premiumCheckErr) {
            return res.status(500).json({ error: 'Failed to check premium status.' });
        }
        const isPremiumMember = premiumCheckResults[0].ispremium === 1;

        if (!isPremiumMember) {
            return res.status(403).json({ error: 'Access denied. You must be a premium member to view the leaderboard.' });
        }

        // SQL query to fetch users ordered by total_expense in descending order
        const query = 'SELECT id, name, total_expense FROM users ORDER BY total_expense DESC';

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch leaderboard data.' });
            }

            const leaderboard = results.map((user) => ({
                id: user.id,
                name: user.name,
                total_expense: user.total_expense,
            }));

            res.status(200).json(leaderboard);
        });
    });
};

// report generation
export const getReport = (req,res) => {
    const userId = req.user.id;
    
    const premiumCheckQuery = 'SELECT ispremium FROM users WHERE id = ?';

    db.query(premiumCheckQuery, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to check premium status.' });
        }
        const isPremiumMember = result[0].ispremium === 1;

        if (!isPremiumMember) {
            return res.status(403).json({ error: 'Access denied. You must be a premium member to generate reports.' });
        }

        // Fetch all expenses for the specific user
        fetchUserExpenses(userId)
            .then(expenses => {
                if (expenses.length === 0) {
                    return res.status(404).json({ error: 'No expenses found for the user.' });
                }

                // Generate and send the CSV report
                generateCSVReport(res, expenses);
            })
            .catch(error => {
                console.error('Error fetching expenses:', error);
                res.status(500).json({ error: 'Failed to fetch expenses.' });
            });
    });

    // Fetch all expenses for a specific user
    function fetchUserExpenses(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM addexpense WHERE user_id = ?';
            db.query(query, [userId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Generate CSV report
    function generateCSVReport(res, expenses) {
        const csvWriter = createCsvWriter({
            path: 'expense_report.csv',
                header: [
                { id: 'id', title: 'ID' },
                { id: 'user_id', title: 'User ID' },
                { id: 'amount_spent', title: 'Amount Spent' },
                { id: 'expense_description', title: 'Expense Description' },
                { id: 'expense_category', title: 'Expense Category' },
            ],
        });

        // Write CSV data
        csvWriter.writeRecords(expenses)
            .then(() => {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="expense_report.csv"');

                // Stream the CSV file to the response
                const fileStream = fs.createReadStream('expense_report.csv');
                fileStream.pipe(res);
            });
    }
}

// check if user is premium or not
export const isUserPremium = (req,res) => {
    const userId = req.user.id;

    const query = 'SELECT ispremium FROM users WHERE id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch user premium status.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const ispremium = results[0].ispremium;

        // Return the ispremium value in the response
        res.status(200).json({ ispremium });
    });
}

// logout user
export const logout = (req,res)=>{
    
    res.clearCookie("access_token",{
        sameSite:"none",
        secure:true
    }).status(200).json("user has been logged out.")
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
