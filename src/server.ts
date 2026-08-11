import dotenv from "dotenv";
dotenv.config({ quiet: true });

import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then(() => {
    console.log("MongoDB connected");
    console.log("bookStore server ready. PORT=", process.env.PORT);
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
