import dbConnect from "../../db/dbConnect.js";
import faqModel from "../../db/models/faq.model.mjs";

export const getFaqs = async () => {
  try {
    await dbConnect();

    const Faqs = await faqModel.find({});

    return {
      status: "ok",
      message: "Faqs fetched successfully",
      data: Faqs,
    };
  } catch (error) {
    console.error("Error fetching faqs:", error);
    return {
      status: "error",
      message: "An error occurred while fetching faqs",
      data: [],
      error: error.message,
    };
  }
};
