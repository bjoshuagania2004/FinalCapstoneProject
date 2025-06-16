import mongoose from "mongoose";
const { Schema } = mongoose;
// ----------------- Post Schema -----------------
const postSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    status: { type: String },
    tags: [String],
    title: String,
    caption: String,
    content: Schema.Types.Mixed,
    revisionNotes: String,
  },
  { timestamps: true }
);
