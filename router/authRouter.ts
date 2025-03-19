import express from "express";
import { authController } from "../controller/authController";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login/email", authController.loginWithEmail);
authRouter.post("/login/google", authController.loginWithGoogle);

export { authRouter };
