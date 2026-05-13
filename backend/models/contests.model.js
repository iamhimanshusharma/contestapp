// contest name, contestId, organizer, problems[], start time, end time, start date, end date, totalPoints 
import mongoose, { Schema } from "mongoose";

const contestSchema = new Schema({
    contestName: {
        type: String,
        required: true,
        unique: true
    },
    contestId: {
        type: String,
        required: true,
        unique: true
    },
    contestOrganizer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    problems: {
        type: [Schema.Types.ObjectId],
        ref: "Problem",
        required: true
    },
    startTime: {
        type: Date,
        required: true,
    },
    durationMinutes: {
        type: Number,
        required: true,
        min: 1,
        max: 180
    },
    registeredUsers: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    totalPoints: {
        type: Number,
        required: true
    }
}, { timestamps: true })


export const Contest = mongoose.model("Contest", contestSchema);
