import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const verificationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

verificationSchema.pre("save", async function () {
  if (!this.isModified("code")) return; 
  this.code = await bcrypt.hash(this.code, 10); 
});

export const Verification = mongoose.model("Verification", verificationSchema);
