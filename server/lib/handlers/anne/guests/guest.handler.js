import dbConnect from "../../../db/dbConnect.js";
import guestModel from "../../../db/models/anne/guest.model.mjs";

// CREATE GUEST
export const createGuest = async (body) => {
  try {
    await dbConnect();

    const data = await guestModel.create(body);

    return {
      status: "ok",
      message: "Guest created successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error adding guest:", error);

    return {
      status: "error",
      message: "An error occurred while creating the guest",
      data: [],
      error: error.message,
    };
  }
};

// UPDATE GUEST
export const updateGuest = async (id, body) => {
  try {
    await dbConnect();

    const guest = await guestModel.findById(id);

    if (!guest) {
      return {
        status: "not_found",
        message: "Guest not found",
        data: [],
      };
    }

    const updatedGuest = await guestModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return {
      status: "ok",
      message: "Guest updated successfully",
      data: updatedGuest,
    };
  } catch (error) {
    console.error("Error updating guest:", error);
    return {
      status: "error",
      message: "An error occurred while updating the guest",
      data: [],
      error: error.message,
    };
  }
};

// DELETE GUEST
export const deleteGuest = async (id) => {
  try {
    await dbConnect();

    const guest = await guestModel.findById(id);
    if (!guest) {
      return {
        status: "not_found",
        message: "Guest not found",
        data: [],
      };
    }

    const deletedGuest = await guestModel.findByIdAndDelete(id);

    return {
      status: "ok",
      message: "Guest deleted successfully",
      data: deletedGuest,
    };
  } catch (error) {
    console.error("Error deleting guest:", error);
    return {
      status: "error",
      message: "An error occurred while deleting the guest",
      data: [],
      error: error.message,
    };
  }
};

// GET GUEST BY ID
export const getGuestById = async (id) => {
  try {
    await dbConnect();

    const guest = await guestModel.findById(id);

    if (!guest) {
      return {
        status: "not_found",
        message: "Guest not found",
        data: [],
      };
    }

    return {
      status: "ok",
      message: "Guest fetched successfully",
      data: guest,
    };
  } catch (error) {
    console.error("Error fetching guest:", error);
    return {
      status: "error",
      message: "An error occurred while fetching the guest",
      data: [],
      error: error.message,
    };
  }
};
