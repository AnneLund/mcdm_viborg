import dbConnect from "../../db/dbConnect.js";
import eventModel from "../../db/models/event.model.mjs";

// CREATE EVENT
export const createEvent = async (body) => {
  try {
    await dbConnect();

    const data = await eventModel.create(body);

    return {
      status: "ok",
      message: "Event created successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error adding event:", error);

    return {
      status: "error",
      message: "An error occurred while creating the event",
      data: [],
      error: error.message,
    };
  }
};

// UPDATE EVENT
export const updateEvent = async (id, body) => {
  try {
    await dbConnect();

    const event = await eventModel.findById(id);

    if (!event) {
      return {
        status: "not_found",
        message: "Event not found",
        data: [],
      };
    }

    const updatedEvent = await eventModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return {
      status: "ok",
      message: "Event updated successfully",
      data: updatedEvent,
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      status: "error",
      message: "An error occurred while updating the event",
      data: [],
      error: error.message,
    };
  }
};

// DELETE EVENT
export const deleteEvent = async (id) => {
  try {
    await dbConnect();

    const event = await eventModel.findById(id);
    if (!event) {
      return {
        status: "not_found",
        message: "Event not found",
        data: [],
      };
    }

    const deletedEvent = await eventModel.findByIdAndDelete(id);

    return {
      status: "ok",
      message: "Event deleted successfully",
      data: deletedEvent,
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      status: "error",
      message: "An error occurred while deleting the event",
      data: [],
      error: error.message,
    };
  }
};

// GET EVENT BY ID
export const getEventById = async (id) => {
  try {
    await dbConnect();

    const event = await eventModel.findById(id);

    if (!event) {
      return {
        status: "not_found",
        message: "Event not found",
        data: [],
      };
    }

    return {
      status: "ok",
      message: "Event fetched successfully",
      data: event,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      status: "error",
      message: "An error occurred while fetching the event",
      data: [],
      error: error.message,
    };
  }
};
