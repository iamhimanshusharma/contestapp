import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

const createToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || "dev-secret",
        { expiresIn: "7d" }
    );
};

const publicUser = (user) => ({
    _id: user._id,
    email: user.email,
    username: user.username
});

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (!normalizedEmail.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email address"
            });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const usernameBase = normalizedEmail.split("@")[0];
        let username = usernameBase;
        let suffix = 1;

        while (await User.findOne({ username })) {
            username = `${usernameBase}${suffix}`;
            suffix += 1;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: normalizedEmail,
            username,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            token: createToken(user),
            user: publicUser(user)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Signup failed"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: createToken(user),
            user: publicUser(user)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

export const me = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: publicUser(req.user)
    });
};
