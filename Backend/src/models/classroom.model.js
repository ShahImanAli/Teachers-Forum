import mongoose, { Schema } from "mongoose";

const classroomSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        students: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }],


        joinCode: {
            type: String,
            required: true,
            unique: true,
        },


    }, { timestamps: true });

export const Classroom = mongoose.model("Classroom", classroomSchema);