import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

import mongoose from "mongoose";
import server from "./app";

const PORT = process.env.PORT ?? 5101; // 5000–6000 oralig'i (.env: 5102 dev, .env.production: 5101)

mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, function () {
      console.info(`The server is running successfully on port ${PORT}`);
      console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
