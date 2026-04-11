import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Verification } from "../models/verification.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { mailer } from "../utils/mailer.js";

const sentOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  await Verification.deleteMany({ email });

  const otpCode = Math.floor(100000 + Math.random() * 900000);

  const isSent = await mailer(email, otpCode);
    
  if (!isSent) {
    throw new ApiError(500, "Error sending OTP");
  }

  await Verification.create({
    email,
    code: otpCode,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent successfully"));
});

export { sentOtp };
