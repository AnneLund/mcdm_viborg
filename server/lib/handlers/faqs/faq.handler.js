import dbConnect from "../../db/dbConnect.js";
import faqModel from "../../db/models/faq.model.mjs";

// ADD FAQ
export const addFaq = async (body) => {
  try {
    await dbConnect();

    const data = await faqModel.create(body);

    return {
      status: "ok",
      message: "Faq created successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error adding faq:", error);

    return {
      status: "error",
      message: "An error occurred while creating the faq",
      data: [],
      error: error.message,
    };
  }
};

// UPDATE FAQ
export const updateFaq = async (body) => {
  try {
    await dbConnect();

    const faq = await faqModel.findById(body.id);
    if (!faq) {
      return {
        status: "not_found",
        message: "Faq not found",
        data: [],
      };
    }
    const updatedFaq = await faqModel.findByIdAndUpdate(body.id, body, {
      new: true,
    });

    return {
      status: "ok",
      message: "Faq updated successfully",
      data: updatedFaq,
    };
  } catch (error) {
    console.error("Error updating faq:", error);
    return {
      status: "error",
      message: "An error occurred while updating the faq",
      data: [],
      error: error.message,
    };
  }
};

// DELETE FAQ
export const deleteFaq = async (id) => {
  try {
    await dbConnect();

    const faq = await faqModel.findById(id);
    if (!faq) {
      return {
        status: "not_found",
        message: "Faq not found",
        data: [],
      };
    }

    const deletedFaq = await faqModel.findByIdAndDelete(id);

    return {
      status: "ok",
      message: "Faq deleted successfully",
      data: deletedFaq,
    };
  } catch (error) {
    console.error("Error deleting faq:", error);
    return {
      status: "error",
      message: "An error occurred while deleting the faq",
      data: [],
      error: error.message,
    };
  }
};

// GET FAQ BY ID
export const getFaqById = async (id) => {
  try {
    await dbConnect();

    const faq = await faqModel.findById(id);

    if (!faq) {
      return {
        status: "not_found",
        message: "Faq not found",
        data: [],
      };
    }

    return {
      status: "ok",
      message: "Faq fetched successfully",
      data: faq,
    };
  } catch (error) {
    console.error("Error fetching faq:", error);
    return {
      status: "error",
      message: "An error occurred while fetching the faq",
      data: [],
      error: error.message,
    };
  }
};
