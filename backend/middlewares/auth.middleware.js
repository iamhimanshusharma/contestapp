import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

export const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid authentication token"
        });
    }
};
