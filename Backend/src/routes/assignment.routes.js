import { Router } from "express";
import { createAssignment, submitAssignment, getSubmissions } from "../controllers/assignment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, upload.array("attachments", 5), createAssignment);
router.route("/submit").post(verifyJWT, upload.array("attachments", 5), submitAssignment);
router.route("/submissions/:postId").get(verifyJWT, getSubmissions);


export default router;
