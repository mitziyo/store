import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

import mongoose from "mongoose";
import server from "./app";

const PORT = process.env.PORT ?? 5050;

mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT ?? 5050;
    server.listen(PORT, function () {
      console.info(`The server is running successfully on port ${PORT}`);
      console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
