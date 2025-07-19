import mongoose from "mongoose";
const { Schema } = mongoose;
// ----------------- User Schema -----------------
export const userSchema = new Schema(
  {
    name: String,
    email: String,
    username: String,
    deliveryUnit: String,
    password: { type: String, minlength: 6 },
    position: String,

    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "organizationprofiles",
    },

    Organization: {
      type: Schema.Types.ObjectId,
      ref: "organizations",
    },
  },
  { timestamps: true }
);
