// contest name, contestId, organizer, problems[], start time, end time, start date, end date, totalPoints 
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light"
    },
}, { timestamps: true })


export const User = mongoose.model("User", userSchema);
