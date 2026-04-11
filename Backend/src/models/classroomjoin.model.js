import mongoose, { Schema } from "mongoose";

const classroomJoinSchema = new Schema(
    {
        classroomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Classroom",
            required: true,
        },
        studentEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
        },
        classOwnerEmail: {
            type: String,
            required: true,
        },
    }, { timestamps: true });

export const ClassroomJoin = mongoose.model("ClassroomJoin", classroomJoinSchema);