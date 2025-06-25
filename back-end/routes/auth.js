// routes/auth.js
import express from "express";
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { encryptPrivateKey } from '../utils/crypto.js';
// import { Resend } from 'resend';

const router = express.Router();

const OTP_EXPIRY_MINUTES = 5;
const otpStore = new Map();

const transporter = nodemailer.createTransport({
    host: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

// const RESEND_API_KEY = process.env.RESEND_API_KEY;

// const resend = new Resend(`${RESEND_API_KEY}`);

const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: "Too many OTP requests. Try again later.",
});

router.post('/request-otp', otpLimiter, async (req, res) => {
    const { email, mobile } = req.body;
    const identifier = email || mobile;
    if (!identifier) return res.status(400).json({ error: 'Email or mobile required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
    otpStore.set(identifier, { otp, expiresAt });

    if (email) {
        try {
            // console.log(otp);
            // console.log(OTP_EXPIRY_MINUTES);
            const info = await transporter.sendMail({
                from: `${process.env.FROM_EMAIL}`,
                to: email,
                subject: 'Your OTP Code',
                html: `<p>Your OTP code is: <strong>${otp}</strong><br>This expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
            });
            // console.log(info.messageId);
            // await resend.emails.send({
            //     from: `${process.env.FROM_EMAIL_RESEND}>`,
            //     to: email,
            //     subject: 'Your OTP Code',
            //     html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
            // });
            res.json({ success: true, message: 'OTP sent' });
        } catch (err) {
            console.error("❌ Failed to send email:", err.message);
            return res.status(500).json({ error: 'Failed to send OTP email' });
        }
    } else {
        // If you're doing SMS later, add it here
        console.log("📱 OTP for mobile login:", mobile, otp);
        // TODO: Send via Twilio or other SMS gateway
        res.json({ success: true, message: 'OTP generated for mobile (SMS not yet implemented)' });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, mobile, otp } = req.body;
    const identifier = email || mobile;
    if (!identifier || !otp) {
        return res.status(400).json({ error: 'Email or mobile and OTP are required' });
    }
    const record = otpStore.get(identifier);
    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    otpStore.delete(identifier);

    // Try to find the user
    let user = await User.findOne({
        $or: [
            email ? { email } : null,
            mobile ? { mobile } : null
        ].filter(Boolean)
    });
    // Create user if not found
    if (!user) {
        user = await User.create({ email, mobile });
    }

    if (!user.matchIdAddress) {
        const privateKey = generatePrivateKey();
        const account = privateKeyToAccount(privateKey);

        user.extraEvmAddress = account.address;
        user.extraEvmEncryptedPrivateKey = encryptPrivateKey(privateKey);
        user.needsMatchIdSetup = false;
        await user.save();

        const token = jwt.sign(
            {
                userId: user._id,
                identifier: identifier,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );

        return res.json({
            success: true,
            user,
            userId: user._id,
            extraEvmAddress: account.address,
            extraEvmPrivateKey: privateKey,
            token,
            needsMatchIdSetup: user.needsMatchIdSetup
        });
    } else {
        const token = jwt.sign(
            {
                userId: user._id,
                identifier: identifier,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );
        user.needsMatchIdSetup = false;
        await user.save();
        res.json({ success: true, user, userId: user._id, extraEvmAddress: account.address, extraEvmPrivateKey: privateKey, token, needsMatchIdSetup: user.needsMatchIdSetup });
    }
});

export default router;
