import mongoose, { Schema, Types, Document } from "mongoose";

export type Status = "applied" | "shortlisted" | "interview" | "rejected" | "hired"

export interface IApplication extends Document {
    job: Types.ObjectId;
    candidate: Types.ObjectId;
    status: Status;
}

const applicationSchema = new Schema<IApplication>({
    job: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    candidate: {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    status: {
        type: String,
        enum: ["applied" , "shortlisted" , "interview" , "rejected" , "hired"],
        default: "applied"
    }
} , {timestamps: true})

applicationSchema.index({job: 1 ,candidate: 1} , {unique: true}) //prevent duplicated application

const Application = mongoose.model("Application" , applicationSchema)

export default Application;