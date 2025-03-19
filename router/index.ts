import express from "express";
import { productRouter } from "./productRouter";
import { userRouter } from "./userRouter";
import { authRouter } from "./authRouter";

const router = express.Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/product", productRouter);
// router.use("/cart", cartRouter);
// router.use("/order", OrderRouter);

export { router };
