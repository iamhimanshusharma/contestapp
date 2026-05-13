import { CommunityPost } from "../models/community.model.js";

const populateCommunityPost = (query) => {
    return query
        .populate("author", "username email")
        .populate("replies.author", "username email");
};

export const getCommunityPosts = async (req, res) => {
    try {
        const posts = await populateCommunityPost(
            CommunityPost.find({}).sort({ createdAt: -1 })
        );

        return res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not load community posts"
        });
    }
};

export const createCommunityPost = async (req, res) => {
    try {
        const { title, body } = req.body;

        if (!title?.trim() || !body?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title and question are required"
            });
        }

        const post = await CommunityPost.create({
            title,
            body,
            author: req.user._id
        });

        const populatedPost = await populateCommunityPost(
            CommunityPost.findById(post._id)
        );

        return res.status(201).json({
            success: true,
            message: "Question posted",
            post: populatedPost
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not post question"
        });
    }
};

export const replyToCommunityPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { body } = req.body;

        if (!body?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Reply cannot be empty"
            });
        }

        const post = await CommunityPost.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        post.replies.push({
            body,
            author: req.user._id
        });
        await post.save();

        const populatedPost = await populateCommunityPost(
            CommunityPost.findById(post._id)
        );

        return res.status(201).json({
            success: true,
            message: "Reply posted",
            post: populatedPost
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not post reply"
        });
    }
};
