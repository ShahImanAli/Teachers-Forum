import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Classroom } from "../models/classroom.model.js";
import { Post } from "../models/post.model.js";
import { Submission } from "../models/submission.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createAssignment = asyncHandler(async (req, res) => {
    const { title, description, classId, deadline } = req.body;

    if (!title || !description || !classId) {
        throw new ApiError(400, "Title, description, and class ID are required");
    }

    const classroom = await Classroom.findById(classId);
    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    if (classroom.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the classroom owner can create assignments");
    }

    let attachments = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const response = await uploadOnCloudinary(file.path);
            if (response) {
                attachments.push({
                    url: response.secure_url,
                    public_id: response.public_id,
                    name: file.originalname,
                    fileType: file.mimetype.split("/")[0],
                });
            }
        }
    }

    // Create a Post with isAssignment set to true
    const post = await Post.create({
        title,
        description,
        classId,
        createdBy: req.user._id,
        deadline,
        attachments,
        isAssignment: true,
    });

    classroom.posts.push(post._id);
    await classroom.save();

    return res
        .status(201)
        .json(new ApiResponse(201, post, "Assignment created successfully"));
});

const submitAssignment = asyncHandler(async (req, res) => {
    const { postId, description } = req.body; // Changed from assignmentId to postId

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    const post = await Post.findById(postId);
    if (!post || !post.isAssignment) {
        throw new ApiError(404, "Assignment post not found");
    }

    let attachments = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const response = await uploadOnCloudinary(file.path);
            if (response) {
                attachments.push({
                    url: response.secure_url,
                    public_id: response.public_id,
                    name: file.originalname,
                    fileType: file.mimetype.split("/")[0],
                });
            }
        }
    }

    const submission = await Submission.create({
        postId,
        studentId: req.user._id,
        description,
        attachments,
    });

    post.submissions.push(submission._id);
    await post.save();

    return res
        .status(201)
        .json(new ApiResponse(201, submission, "Assignment submitted successfully"));
});

const getSubmissions = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate({
        path: "submissions",
        populate: {
            path: "studentId",
            select: "fullName username email"
        }
    });

    if (!post || !post.isAssignment) {
        throw new ApiError(404, "Assignment post not found");
    }

    const classroom = await Classroom.findById(post.classId);
    if (classroom.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the teacher can view submissions");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, post.submissions, "Submissions retrieved successfully"));
});

export { createAssignment, submitAssignment, getSubmissions };
