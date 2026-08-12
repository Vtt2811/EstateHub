import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD, // 16-character Google App Password
        },
    });
};

export const register = async (req, res) => {
    const { username, email, password, role, licenseDocument } = req.body;

    try {
        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: 'Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character.' 
            });
        }

        // Determine role — ADMIN cannot be registered through public API
        let assignedRole = role || 'BUYER';
        if (assignedRole === 'ADMIN') {
            // Silently downgrade: no public path to ADMIN
            assignedRole = 'BUYER';
        }

        // AGENT requires a license document
        if (assignedRole === 'AGENT' && !licenseDocument) {
            return res.status(400).json({
                message:
                    'Agents must upload a valid license or ID document before registering.',
            });
        }

        // Check for existing username or email
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'Username already exists. Please try a different username.' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email already exists. Please try a different email.' });
            }
        }

        // HASH THE PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // Build user data object
        const userData = {
            username,
            email,
            password: hashedPassword,
            role: assignedRole,
        };

        // Only set agent-specific fields when role is AGENT
        if (assignedRole === 'AGENT') {
            userData.agentStatus = 'PENDING';
            userData.licenseDocument = licenseDocument;
        }

        // CREATE A NEW USER AND SAVE IT TO DATABASE
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpiry = new Date(Date.now() + 3600000); // 1 hour

        const newUser = await prisma.user.create({ 
            data: {
                ...userData,
                isVerified: false,
                verificationToken,
                verificationExpiry
            } 
        });

        console.log('Registered user:', newUser.username, 'with role:', newUser.role);

        // Removed automatic verification email sending to make verification optional
        res.status(201).json({ message: 'Registration successful. You can now log in.' });
    } catch (error) {
        console.log('Register error:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // CHECK IF THE USER EXISTS OR NOT
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            // Note: returning specific error trades minor username-enumeration risk for better UX
            return res.status(401).json({ message: 'Invalid username' });
        }

        // CHECK USER PASSWORD IS CORRECT OR NOT
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // GENERATE A COOKIE TOKEN AND SEND IT TO THE USER
        const age = 1000 * 60 * 60 * 24 * 7; // 1 week

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                agentStatus: user.agentStatus || null,
                isAdmin: user.role === 'ADMIN',
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: age }
        );

        // Transfer user data directly, excluding password
        const { password: userPassword, ...userInfo } = user;

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: age,
            // secure: true,  // enable in production with HTTPS
        })
            .status(200)
            .json(userInfo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to login' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token').status(200).json({ message: 'Logged out successfully' });
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationExpiry: { gt: new Date() }
            }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null, verificationExpiry: null }
        });
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to verify email' });
    }
};

export const resendVerification = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpiry = new Date(Date.now() + 3600000);
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken, verificationExpiry }
        });
        
        const transporter = getTransporter();
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your EstateHub account',
            html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">${verificationUrl}</a>`
        });
        res.status(200).json({ message: 'Verification email resent' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to resend verification email' });
    }
};

export const updateEmail = async (req, res) => {
    const { username, password, newEmail } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Account is already verified. Cannot change email.' });
        }

        // Check if new email is already taken
        const existingEmail = await prisma.user.findUnique({ where: { email: newEmail } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpiry = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { id: user.id },
            data: { 
                email: newEmail,
                verificationToken, 
                verificationExpiry 
            }
        });

        const transporter = getTransporter();
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: newEmail,
            subject: 'Verify your EstateHub account',
            html: `<p>Please verify your new email by clicking the link below:</p><a href="${verificationUrl}">${verificationUrl}</a>`
        });

        res.status(200).json({ message: 'Email updated and new verification link sent' });
    } catch (err) {
        console.error("Update email error:", err);
        res.status(500).json({ message: 'Failed to update email' });
    }
};

export const sendVerificationEmail = async (req, res) => {
    try {
        const userId = req.userId; // Provided by verifyToken middleware

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpiry = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken, verificationExpiry }
        });

        const transporter = getTransporter();
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Verify your EstateHub account',
            html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">${verificationUrl}</a>`
        });
        
        console.log(`Optional verification email sent to ${user.email}. Link: ${verificationUrl}`);
        res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
    } catch (err) {
        console.error("Send verification email error:", err);
        res.status(500).json({ message: 'Failed to send verification email' });
    }
};