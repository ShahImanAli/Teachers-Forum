import { Router } from "express";
import { sentOtp } from "../controllers/verification.controller.js";

const router = Router();

// Route to send OTP
router.route("/send-otp").post(sentOtp);

export default router;
