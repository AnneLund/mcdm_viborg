import dbConnect from "../../db/dbConnect.js";
import exerciseModel from "../../db/models/exercise.model.mjs";

export const getExercises = async () => {
  try {
    await dbConnect();

    const Exercises = await exerciseModel.find({});

    return {
      status: "ok",
      message: "Exercises fetched successfully",
      data: Exercises,
    };
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return {
      status: "error",
      message: "An error occurred while fetching exercises",
      data: [],
      error: error.message,
    };
  }
};
