import mongoose, { Schema } from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["teacher", "student"],
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"], 
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//direct encrpytion is not possible so we have to use mongoose hook
// one of them is pre hook (basically a middleware) just at time of data about to save
// in database you can run this pre hook a time little before saving the data if you want
// you can put any code in it and execute it
//matlab mai nhi chahta ky data aisay save hojaye uss phelay kuch kar dain hum
// matlab password encrpt kardain hum

//kon kon sy event py karna chahte hoon like validate , save , remove , updateOne , deleteOne
//mujhe abhi save ko use karna hai

//never use arrow functions here because arrow functions do not have access of this so we use fn

//hash password before saving user
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; //only encrypt password when password is modified

  this.password = await bcrypt.hash(this.password, 10); //10 is salt / hash-rounds it can be default
});

//mongoose allow you to inject methods like validate , save , remove , updateOne , deleteOne

//custom method to compare password if it is correct or not
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); //compare method requires password in string and encrypted password (hash rounds)
};

//JWT is a bearer token means whoever has this token can access the protected resources

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
