import dotenv from "dotenv";
dotenv.config({ quiet: true });

import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT ?? 3000;

mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log("bookStore server ready. PORT=", PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
