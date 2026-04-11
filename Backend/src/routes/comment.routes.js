import { Router } from "express";
import { addComment, getCommentsByPost } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT, addComment);
router.route("/:postId").get(verifyJWT, getCommentsByPost);

export default router;
