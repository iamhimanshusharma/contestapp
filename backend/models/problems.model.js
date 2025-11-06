import mongoose, { Schema } from "mongoose";

const TestcaseSchema = new Schema({
    input: { type: String, required: true },
    expected: { type: String, required: true }
});

const problemSchema = new Schema({
    problemId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
    },
    description: {
        type: String,
        required: true,
    },
    input: {
        type: String,
        required: true,
    },
    output: {
        type: String,
        required: true,
    },
    constraints: {
        type: String,
        required: true,
    },
    testcases: {
        type: [TestcaseSchema],
        required: true
    },
    createdby: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });


export const Problem = mongoose.model("Problem", problemSchema);