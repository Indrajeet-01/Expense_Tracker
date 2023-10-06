
import { sendResetCodeEmail } from "../middleware/sendEmail.js";

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import fs from 'fs'
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

import User from '../models/user.js'
import AddExpense from "../models/expense.js";
import ResetCode from "../models/resetCode.js";

// register new user
export const register = (req, res) => {
    // Check if a user with the given email already exists
    User.findOne({ $or: [{ name: req.body.name }, { email: req.body.email }] })
        .then(existingUser => {
            if (existingUser) {
                return res.status(409).json("User already exists!");
            }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            is_premium: req.body.is_premium || false, 
            total_expense: req.body.total_expense || 0, 
        });

        // Save the new user to the database
        newUser.save()
            .then(() => {
                return res.status(200).json("User registered successfully");
            })
            .catch(error => {
                return res.status(500).json(error.message);
            });
        })
        .catch(err => {
            return res.status(500).json(err.message);
    });
};

// login user
export const login = (req, res) => {
    
    User.findOne({ name: req.body.name })
        .then(user => {
            if (!user) {
                return res.status(404).json("User not found");
            }

        // Check if the provided password matches the hashed password in the database
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json("Wrong username or password");
        }

        // Generate a JSON Web Token (JWT) for user authentication
        const token = jwt.sign({ id: user._id }, "jwtkey");

        const responseData = {
            id: user._id,
            name: user.name,
            email: user.email,
            is_premium: user.is_premium,
            access_token: token,
        };

        // Set the access_token as an HTTP-only cookie for secure storage
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(responseData);
    })
    .catch(err => {
        return res.status(500).json(err.message);
    });
};

// get leader board by premium member
export const getLeaderboard = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId, 'is_premium');

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isPremiumMember = user.is_premium;

        if (!isPremiumMember) {
            return res.status(403).json({ error: 'Access denied. You must be a premium member to view the leaderboard.' });
        }

      // Fetch users ordered by total_expense in descending order
        const leaderboard = await User.find({}, 'name total_expense')
            .sort({ total_expense: -1 });

        res.status(200).json(leaderboard);
    } catch (error) {
            console.error('Error fetching leaderboard data:', error);
            res.status(500).json({ error: 'Failed to fetch leaderboard data.' });
        }
};


// report generation
export const getReport = async (req, res) => {
    const userId = req.user.id;

    try {
      // Find the user by their _id and project the 'is_premium' field
        const user = await User.findById(userId, 'is_premium');

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isPremiumMember = user.is_premium;

        if (!isPremiumMember) {
            return res.status(403).json({ error: 'Access denied. You must be a premium member to generate reports.' });
        }

      // Fetch all expenses for the specific user
        const expenses = await AddExpense.find({ user: userId });

        if (expenses.length === 0) {
            return res.status(404).json({ error: 'No expenses found for the user.' });
        }

        generateCSVReport(res, expenses);
    } catch (error) {
        console.error('Error fetching user premium status or expenses:', error);
        res.status(500).json({ error: 'Failed to fetch user premium status or expenses.' });
    }
};

// Generate CSV report
function generateCSVReport(res, expenses) {
    const csvWriter = createCsvWriter({
        path: 'expense_report.csv',
        header: [
        
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

// check if user is premium or not
export const isUserPremium = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId, 'is_premium');

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isPremium = user.is_premium;

        res.status(200).json({ isPremium });
    } catch (error) {
        console.error('Error fetching user premium status:', error);
        res.status(500).json({ error: 'Failed to fetch user premium status.' });
    }
};

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
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove any existing reset code for this user
      await ResetCode.deleteMany({ user_id: user._id });
  
      // Generate a new reset code
      const code = generateCode(5);
  
      // Create a new reset code document
      const resetCode = new ResetCode({
        code,
        user_id: user._id,
      });
  
      await resetCode.save();
  
      // Send the reset code via email
      sendResetCodeEmail(user.email, user.name, code);
  
      return res.status(200).json({
        message: 'Email reset code has been sent to your email',
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Helper function to generate a reset code
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
  export const updatePassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
  
    try {
      // Find the user and reset code
      const user = await User.findOne({ email });
      const resetCode = await ResetCode.findOne({ user_id: user._id, code });
  
      if (!user || !resetCode) {
        return res.status(404).json({ message: 'Invalid reset code' });
      }
  
      // Check if the reset code has expired (1 hour duration)
      const currentTime = new Date();
      const codeExpirationTime = new Date(resetCode.created_at);
      codeExpirationTime.setHours(codeExpirationTime.getHours() + 1);
  
      if (currentTime > codeExpirationTime) {
        return res.status(400).json({ message: 'Reset code has expired' });
      }
  
      // Hash the new password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);
  
      // Update the user's password in the users collection
      await User.updateOne({ email }, { password: hash });
  
      // Delete the used reset code document
      await ResetCode.findByIdAndDelete(resetCode._id);
  
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }; 