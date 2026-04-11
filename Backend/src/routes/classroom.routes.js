import { Router } from "express";
import {
  createClassroom,
  listClassrooms,
  joinClassroom,
  searchClassrooms,
  classroomJoinedByStudent,
  getClassroomDetail,
  addPost,
  deleteClassroom,
  deletePost,
  leaveClassroom,
} from "../controllers/classroom.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Create a classroom (only for teachers)
router.route("/create").post(verifyJWT, createClassroom);

// List classrooms for the current user (Teachers see owned, Students see joined)
router.route("/listclassrooms").get(verifyJWT, listClassrooms);

// Join a classroom with a code
router.route("/join").post(verifyJWT, joinClassroom);

// Search classrooms (for discovery)
router.route("/search").get(verifyJWT, searchClassrooms);

// Get joined classrooms explicitly
router.route("/joined").get(verifyJWT, classroomJoinedByStudent);

// Get classroom detail
router.route("/:classroomId").get(verifyJWT, getClassroomDetail);

// Add post to classroom (with file support)
router.route("/add-post").post(verifyJWT, upload.array("attachments", 5), addPost);

// Delete classroom
router.route("/delete-classroom/:classroomId").delete(verifyJWT, deleteClassroom);

// Delete post
router.route("/delete-post/:postId").delete(verifyJWT, deletePost);

// Leave classroom
router.route("/leave-classroom/:classroomId").post(verifyJWT, leaveClassroom);


export default router;

