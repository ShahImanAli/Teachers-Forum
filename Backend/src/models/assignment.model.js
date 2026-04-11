import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
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
        deadline: {
            type: Date,
        },
        attachments: [{
            url: { type: String },
            public_id: { type: String },
            name: { type: String },
            fileType: { type: String }
        }],
        submissions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission",
        }]

    }, { timestamps: true });

export const Assignment = mongoose.model("Assignment", assignmentSchema);
