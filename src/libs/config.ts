export const MORGAN_FORMAT = ":method :url :response-time [:status] \n";

// Start 1
import mongoose from "mongoose";
export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};
// End 1
