import mongoose, { Types } from "mongoose";

import { IJwt } from "../common/interfaces";
import { User } from "./user.model";

const tokenSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    token: { type: String, required: true },
    _userId: { type: Types.ObjectId, required: true, ref: User },
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

export const Token = mongoose.model<IJwt>("tokens", tokenSchema);
