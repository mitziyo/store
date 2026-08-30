import { MemberStatus, MemberType } from "../enums/member.enum";
import mongoose from "mongoose";
import { Request } from "express";
import { Session } from "express-session";

export interface Member {
  _id: mongoose.Types.ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints?: number;
}

export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

// Start 1
export interface AdminRequest extends Request {
  member: Member;
  session: Session & { member: Member };
  file?: Express.Multer.File; // multer bitta faylni shu yerga qo'yadi (masalan memberImage)
}
// End 1
