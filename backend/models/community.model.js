import mongoose, { Schema } from "mongoose";

const replySchema = new Schema({
    body: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const communityPostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    replies: {
        type: [replySchema],
        default: []
    }
}, { timestamps: true });

export const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);
