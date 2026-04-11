import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Classroom } from "../models/classroom.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { Assignment } from "../models/assignment.model.js";


const createClassroom = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  if (req.user.role !== "teacher") {
    throw new ApiError(403, "Only teachers can create classrooms");
  }

  const existing = await Classroom.findOne({ name, owner: req.user._id });
  if (existing) {
    throw new ApiError(400, "You already have a classroom with this name");
  }

  const joinCode = Math.floor(100000 + Math.random() * 900000).toString();

  const classroom = await Classroom.create({
    name,
    description,
    owner: req.user._id,
    joinCode
  });

  return res
    .status(201)
    .json(new ApiResponse(201, classroom, "Classroom created successfully"));
});

const listClassrooms = asyncHandler(async (req, res) => {
  
  let classrooms

  if (req.user.role === "teacher") {
    classrooms = await Classroom.find({ owner: req.user._id })
      .populate("owner", "fullName username email")
      .sort({ createdAt: -1 });
  } else {
    classrooms = await Classroom.find({ students: req.user._id })
      .populate("owner", "fullName username email")
      .sort({ createdAt: -1 });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, classrooms, "Classrooms retrieved successfully")
    );
});

const joinClassroom = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new ApiError(400, "Join code is required");
  }

  const classroom = await Classroom.findOne({ joinCode: code });
  if (!classroom) {
    throw new ApiError(404, "Invalid join code or classroom not found");
  }

  const userId = req.user._id;

  if (classroom.students.includes(userId)) {
    throw new ApiError(400, "You have already joined this classroom");
  }

  if (classroom.owner.toString() === userId.toString()) {
    throw new ApiError(400, "You are the teacher of this classroom");
  }

  classroom.students.push(userId);
  await classroom.save();

  return res
    .status(200)
    .json(new ApiResponse(200, classroom, "Joined classroom successfully"));
});


const addPost = asyncHandler(async (req, res) => {
  const { title, description, classId, isAssignment, deadline } = req.body;

  if (!title || !description || !classId) {
    throw new ApiError(400, "Title, description, and class ID are required");
  }

  const classroom = await Classroom.findById(classId);
  if (!classroom) {
    throw new ApiError(404, "Classroom not found");
  }

  if (classroom.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the classroom owner can add posts");
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

  const post = await Post.create({
    title,
    description,
    classId,
    createdBy: req.user._id,
    attachments,
    isAssignment: isAssignment === "true" || isAssignment === true,
    deadline: deadline || null,
  });


  classroom.posts.push(post._id);
  await classroom.save();

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

const searchClassrooms = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const classrooms = await Classroom.find({
    name: { $regex: query, $options: "i" },
  })
    .populate("owner", "fullName username email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, classrooms, "Classrooms retrieved successfully")
    );
});


const classroomJoinedByStudent = asyncHandler(async (req, res) => { 

  if (req.user.role !== "student") {
    throw new ApiError(403, "Only students can view joined classrooms");
  }

  const classrooms = await Classroom.find({ students: req.user._id })
    .populate("owner", "fullName username email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, classrooms, "Joined classrooms retrieved successfully")
    );

})

const getClassroomDetail = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;

  if (!classroomId) {
    throw new ApiError(400, "Classroom ID is required");
  }

  const classroom = await Classroom.findById(classroomId)
    .populate("owner", "fullName username email")
    .populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "comments",
          populate: {
            path: "createdBy",
            select: "fullName username"
          }
        },
        {
          path: "submissions",
          populate: {
            path: "studentId",
            select: "fullName username email"
          }
        }
      ]
    })
    .populate("students", "fullName username email");




  if (!classroom) {
    throw new ApiError(404, "Classroom not found");
  }

  // Permission check: owner or joined student
  const isOwner = classroom.owner._id.toString() === req.user._id.toString();
  const isStudent = classroom.students.some(s => s._id.toString() === req.user._id.toString());

  if (!isOwner && !isStudent) {
    throw new ApiError(403, "You are not a member of this classroom");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, classroom, "Classroom details retrieved successfully"));
});




const deleteClassroom = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;

  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(404, "Classroom not found");
  }

  if (classroom.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the owner can delete this classroom");
  }

  // Delete all posts in this classroom and their attachments from Cloudinary
  const posts = await Post.find({ classId: classroomId });
  for (const post of posts) {
    if (post.attachments && post.attachments.length > 0) {
      for (const file of post.attachments) {
        await deleteFromCloudinary(file.public_id, { resource_type: "auto" });
      }
    }
  }
  await Post.deleteMany({ classId: classroomId });

  // Delete classroom
  await Classroom.findByIdAndDelete(classroomId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Classroom deleted successfully"));
});



const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const classroom = await Classroom.findById(post.classId);
  if (classroom.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the teacher can delete this post");
  }

  // Delete attachments from Cloudinary
  if (post.attachments && post.attachments.length > 0) {
    for (const file of post.attachments) {
      await deleteFromCloudinary(file.public_id, { resource_type: "auto" });
    }
  }

  // Remove post reference from classroom
  classroom.posts = classroom.posts.filter((id) => id.toString() !== postId);
  await classroom.save();

  // Delete post
  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

const leaveClassroom = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;

  if (!classroomId) {
    throw new ApiError(400, "Classroom ID is required");
  }

  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(404, "Classroom not found");
  }

  const userId = req.user._id;

  if (!classroom.students.includes(userId)) {
    throw new ApiError(400, "You are not a member of this classroom");
  }

  classroom.students = classroom.students.filter(
    (studentId) => studentId.toString() !== userId.toString()
  );
  await classroom.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Left classroom successfully"));
});

export {
  createClassroom,
  listClassrooms,
  joinClassroom,
  addPost,
  searchClassrooms,
  classroomJoinedByStudent,
  getClassroomDetail,
  deleteClassroom,
  deletePost,
  leaveClassroom,
};

