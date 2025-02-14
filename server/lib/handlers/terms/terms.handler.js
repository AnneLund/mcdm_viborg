import dbConnect from "../../db/dbConnect.js";
import termModel from "../../db/models/term.model.mjs";

export const getTerms = async () => {
  try {
    await dbConnect();

    const Terms = await termModel.find({});

    return {
      status: "ok",
      message: "Terms fetched successfully",
      data: Terms,
    };
  } catch (error) {
    console.error("Error fetching terms:", error);
    return {
      status: "error",
      message: "An error occurred while fetching terms",
      data: [],
      error: error.message,
    };
  }
};
