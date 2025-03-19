import mongoose, { Document, Model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  level: string;
  generateToken(): string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    level: { type: String, default: "customer" },
  },
  { timestamps: true }
);

// 비밀번호 숨기기
userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj;
};

// 토큰 생성
userSchema.methods.generateToken = function (): string {
  const token = jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

// 모델 생성 및 Export
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
