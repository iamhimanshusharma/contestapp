import mongoose, { Schema } from "mongoose";

const testcaseSch = new Schema({
    input: { type: String, required: true },
    expected: { type: String, required: true },
    testcaseType: {
        type: String,
        enum: ["sample", "hidden"]
    }
});

const testcaseSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: "Problem",
        unique: true
    },
    testcases: {
        type: [testcaseSch],
        required: true
    }
}, { timestamps: true });



export const TestCase = mongoose.model("Testcase", testcaseSchema);