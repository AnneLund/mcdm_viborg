import mongoose from "mongoose";

export const isValidObjectId = (id) => {
  if (!id || typeof id !== "string") {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return new mongoose.Types.ObjectId(id);
};
