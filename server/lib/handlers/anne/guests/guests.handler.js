import dbConnect from "../../../db/dbConnect.js";
import guestModel from "../../../db/models/anne/guest.model.mjs";

export const getGuests = async () => {
  try {
    await dbConnect();

    const guests = await guestModel.find({});

    return {
      status: "ok",
      message: "Guests fetched successfully",
      data: guests,
    };
  } catch (error) {
    console.error("Error fetching guests:", error);
    return {
      status: "error",
      message: "An error occurred while fetching guests",
      data: [],
      error: error.message,
    };
  }
};
