import mongoose, { Schema } from "mongoose";

const testcaseSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: "Problem",
        unique: true
    },
    input: {
        type: [String],
        required: true
    },
    output: {
        type: [String],
        required: true
    }
}, { timestamps: true });

export const TestCase = mongoose.model("Testcase", testcaseSchema);