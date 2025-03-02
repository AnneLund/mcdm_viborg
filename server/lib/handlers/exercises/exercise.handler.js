import dbConnect from "../../db/dbConnect.js";
import exerciseModel from "../../db/models/exercise.model.mjs";

// CREATE EXERCISE
export const createExercise = async (body) => {
  try {
    await dbConnect();

    const data = await exerciseModel.create(body);

    return {
      status: "ok",
      message: "Exercise created successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error adding exercise:", error);

    return {
      status: "error",
      message: "An error occurred while creating the exercise",
      data: [],
      error: error.message,
    };
  }
};

// UPDATE EXERCISE
export const updateExercise = async (id, body) => {
  try {
    await dbConnect();

    const exercise = await exerciseModel.findById(id);

    if (!exercise) {
      return {
        status: "not_found",
        message: "Exercise not found",
        data: [],
      };
    }

    const updatedExercise = await exerciseModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    return {
      status: "ok",
      message: "Exercise updated successfully",
      data: updatedExercise,
    };
  } catch (error) {
    console.error("Error updating exercise:", error);
    return {
      status: "error",
      message: "An error occurred while updating the exercise",
      data: [],
      error: error.message,
    };
  }
};

// DELETE EXERCISE
export const deleteExercise = async (id) => {
  try {
    await dbConnect();

    const exercise = await exerciseModel.findById(id);
    if (!exercise) {
      return {
        status: "not_found",
        message: "Exercise not found",
        data: [],
      };
    }

    const deletedExercise = await exerciseModel.findByIdAndDelete(id);

    return {
      status: "ok",
      message: "Exercise deleted successfully",
      data: deletedExercise,
    };
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return {
      status: "error",
      message: "An error occurred while deleting the exercise",
      data: [],
      error: error.message,
    };
  }
};

// GET EXERCISE BY ID
export const getExerciseById = async (id) => {
  try {
    await dbConnect();

    const exercise = await exerciseModel.findById(id);

    if (!exercise) {
      return {
        status: "not_found",
        message: "Exercise not found",
        data: [],
      };
    }

    return {
      status: "ok",
      message: "Exercise fetched successfully",
      data: exercise,
    };
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return {
      status: "error",
      message: "An error occurred while fetching the exercise",
      data: [],
      error: error.message,
    };
  }
};
