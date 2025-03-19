import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
  throw new Error("JWT secret key is not defined in environment variables");
}

const saltRounds = 10;

export const authController = {
  // 회원가입 (register)
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, level } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res
          .status(409)
          .json({ status: "fail", message: "User already registered." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = new User({
        name,
        email,
        password: hash,
        level: level ? level : "customer",
      });
      await newUser.save();

      res
        .status(200)
        .json({ status: "success", message: "Registration successful!" });
    } catch (error: unknown) {
      res.status(500).json({
        status: "fail",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  },
  // 로그인 (loginWithEmail)
  loginWithEmail: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select(
        "-createdAt -updatedAt -__v"
      );

      if (!user) {
        // 사용자가 없을 때
        res.status(404).json({ status: "fail", message: "User not found." });
        return;
      } else {
        // 사용자가 있을 때 비밀번호 일치 여부
        const isMatch = await bcrypt.compareSync(password, user.password);

        if (!isMatch) {
          res
            .status(400)
            .json({ status: "fail", message: "Incorrect password." });
          return;
        }

        const token = user.generateToken();
        res.status(200).json({ status: "success", user, token });
      }
    } catch (error: unknown) {
      res.status(500).json({
        status: "fail",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  },
  // 구글 로그인 (loginWithGoogle)
  loginWithGoogle: async (req: Request, res: Response) => {},
  // 인증 (authenticate)
  authenticate: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const tokenString = req.headers.authorization;
      if (!tokenString) {
        res
          .status(401)
          .json({ status: "fail", message: "Unauthorized: No token provided" });
        return;
      }

      const token = tokenString.replace("Bearer ", "");
      jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
        if (
          error ||
          !payload ||
          typeof payload !== "object" ||
          !("_id" in payload)
        ) {
          res
            .status(401)
            .json({ status: "fail", message: "Unauthorized: Invalid token" });
          return;
        }

        (req as any).userId = payload._id as string;

        next();
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  },
};
