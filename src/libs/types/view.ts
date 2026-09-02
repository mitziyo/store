import mongoose from "mongoose";
import { ViewGroup } from "../enums/view.enum";

export interface View {
  _id: mongoose.Types.ObjectId;
  viewGroup: ViewGroup;
  memberId: mongoose.Types.ObjectId;
  viewRefId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ViewInput {
  viewGroup: ViewGroup;
  memberId: mongoose.Types.ObjectId;
  viewRefId: mongoose.Types.ObjectId;
}
