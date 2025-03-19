import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import { router as indexRouter } from "./router/index";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // req.body가 객체로 인식이 됨
app.use("/api", indexRouter);

const mongoURI = process.env.MONGODB_URI as string;

mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ Connected to DB");
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
