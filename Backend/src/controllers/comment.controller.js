import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";

const addComment = asyncHandler(async (req, res) => {
    const { content, postId } = req.body;

    if (!content || !postId) {
        throw new ApiError(400, "Content and post ID are required");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const comment = await Comment.create({
        content,
        postId,
        createdBy: req.user._id,
    });

    post.comments.push(comment._id);
    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate("createdBy", "fullName username");

    return res
        .status(201)
        .json(new ApiResponse(201, populatedComment, "Comment added successfully"));
});

const getCommentsByPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    const comments = await Comment.find({ postId })
        .populate("createdBy", "fullName username")
        .sort({ createdAt: 1 });

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});

export { addComment, getCommentsByPost };
