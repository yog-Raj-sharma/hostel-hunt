const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Import Nodemailer
const User = require('../models/User');
const router = express.Router();

// Store OTPs temporarily (in-memory store for simplicity; for production, use a database or cache)
const otps = {};

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
        user: 'yraj_be21@thapar.edu', // Replace with your email
        pass: 'sdpe eymq xtea chpt', // Replace with your email password or app password if 2FA is enabled
    },
});

// Sign Up - Step 1: Initiate Sign Up and Send OTP
router.post('/signup', async (req, res) => {
    const { email, name, gender, year, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        const userExists = !!user;

        // Generate and store OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        otps[email] = { otp, name, gender, year, password, userExists };

        // Send OTP via email
        const mailOptions = {
            from: 'linkitallnow@gmail.com', // Replace with your email
            to: email,
            subject: 'Your OTP for Sign Up',
            text: `Your OTP is ${otp}. Please use this to complete your sign-up process.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP email:', error);
                return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
            }
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: userExists ? 'User exists, proceed to OTP verification' : 'OTP sent for sign up', userExists });
        });
    } catch (error) {
        console.error('Sign Up Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Sign Up - Step 2: Verify OTP and Complete Sign Up or Password Reset
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
        const otpData = otps[email];

        if (!otpData || otpData.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const { name, gender, year, password, userExists } = otpData;

        if (userExists) {
    // If the user exists, update their password and year
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.updateOne(
        { email },
        { $set: { password: hashedPassword, year } }
    );
    res.status(200).json({ message: 'Password and year updated successfully' });
} else {
    // If the user does not exist, create a new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, name, gender, year, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
}

        // Clean up OTP after successful verification
        delete otps[email];
    } catch (error) {
        console.error('OTP Verification Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Sign In
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Sign In successful', token });
    } catch (error) {
        console.error('Sign In Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;