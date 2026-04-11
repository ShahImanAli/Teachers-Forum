import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        description: {
            type: String,
        },
        attachments: [{
            url: { type: String },
            public_id: { type: String },
            name: { type: String },
            fileType: { type: String }
        }],
    }, { timestamps: true });

export const Submission = mongoose.model("Submission", submissionSchema);
