import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    problem: {
        type: Schema.Types.ObjectId,
        ref: "Problem",
        required: true
    },
    contest: {
        type: Schema.Types.ObjectId,
        ref: "Contest",
        default: null
    },
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    verdict: {
        type: String,
        required: true
    },
    passed: {
        type: Boolean,
        required: true
    },
    score: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Submission = mongoose.model("Submission", submissionSchema);
