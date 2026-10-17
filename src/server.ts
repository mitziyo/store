import dotenv from "dotenv";
dotenv.config({ quiet: true });

import mongoose from "mongoose";
import server from "./app";

const PORT = process.env.PORT ?? 3000;

mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then(() => {
    console.log("MongoDB connected");
     const PORT = process.env.PORT ?? 3000;
    server.listen(PORT, function () {
      console.info(`The server is running successfully on port ${PORT}`);
    //  console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
