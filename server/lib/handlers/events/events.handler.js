import dbConnect from "../../db/dbConnect.js";
import eventModel from "../../db/models/event.model.mjs";

export const getEvents = async () => {
  try {
    await dbConnect();

    const events = await eventModel.find({});

    return {
      status: "ok",
      message: "Events fetched successfully",
      data: events,
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      status: "error",
      message: "An error occurred while fetching events",
      data: [],
      error: error.message,
    };
  }
};
