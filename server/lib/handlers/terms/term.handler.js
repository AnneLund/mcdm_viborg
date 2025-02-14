import dbConnect from "../../db/dbConnect.js";
import termModel from "../../db/models/term.model.mjs";

// ADD BLOG
export const addTerm = async (body) => {
  try {
    await dbConnect();

    if (!body.image) {
      body.image = `${process.env.SERVER_HOST}/terms/no-term.jpg`;
    }

    const data = await termModel.create(body);

    return {
      status: "ok",
      message: "Term created successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error adding term:", error);

    return {
      status: "error",
      message: "An error occurred while creating the term",
      data: [],
      error: error.message,
    };
  }
};

// UPDATE BLOG
export const updateTerm = async (body) => {
  try {
    await dbConnect();

    const term = await termModel.findById(body.id);
    if (!term) {
      return {
        status: "not_found",
        message: "Term not found",
        data: [],
      };
    }
    const updatedTerm = await termModel.findByIdAndUpdate(body.id, body, {
      new: true,
    });

    return {
      status: "ok",
      message: "Term updated successfully",
      data: updatedTerm,
    };
  } catch (error) {
    console.error("Error updating term:", error);
    return {
      status: "error",
      message: "An error occurred while updating the term",
      data: [],
      error: error.message,
    };
  }
};

// DELETE BLOG
export const deleteTerm = async (id) => {
  try {
    await dbConnect();

    const term = await termModel.findById(id);
    if (!term) {
      return {
        status: "not_found",
        message: "Term not found",
        data: [],
      };
    }

    const deletedTerm = await termModel.findByIdAndDelete(id);

    return {
      status: "ok",
      message: "Term deleted successfully",
      data: deletedTerm,
    };
  } catch (error) {
    console.error("Error deleting term:", error);
    return {
      status: "error",
      message: "An error occurred while deleting the term",
      data: [],
      error: error.message,
    };
  }
};

// GET BLOG BY ID
export const getTermById = async (id) => {
  try {
    await dbConnect();

    const term = await termModel.findById(id);

    if (!term) {
      return {
        status: "not_found",
        message: "Term not found",
        data: [],
      };
    }

    return {
      status: "ok",
      message: "Term fetched successfully",
      data: term,
    };
  } catch (error) {
    console.error("Error fetching term:", error);
    return {
      status: "error",
      message: "An error occurred while fetching the term",
      data: [],
      error: error.message,
    };
  }
};
