import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Classroom",
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        attachments: [{
            url: { type: String },
            public_id: { type: String },
            name: { type: String },
            fileType: { type: String }
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }],
        isAssignment: {
            type: Boolean,
            default: false,
        },
        deadline: {
            type: Date,
        },
        submissions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission",
        }]



    }, { timestamps: true });

export const Post = mongoose.model("Post", postSchema);
