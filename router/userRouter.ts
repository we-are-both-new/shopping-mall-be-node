import express from "express";
import { userController } from "../controller/userController";
import { authController } from "../controller/authController";

const userRouter = express.Router();

userRouter.get("/getUser", authController.authenticate, userController.getUser);

export { userRouter };
