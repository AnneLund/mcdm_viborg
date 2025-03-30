import dbConnect from "../../../db/dbConnect.js";
import invitationModel from "../../../db/models/anne/invitation.model.mjs";

// CREATE EXERCISE
export const createInvitation = async (body) => {
  try {
    await dbConnect();

    const data = await invitationModel.create(body);

    return {
      status: "ok",
      message: "Invitation created successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error adding invitation:", error);

    return {
      status: "error",
      message: "An error occurred while creating the invitation",
      data: [],
      error: error.message,
    };
  }
};

// UPDATE EXERCISE
export const updateInvitation = async (id, body) => {
  try {
    await dbConnect();

    const invitation = await invitationModel.findById(id);

    if (!invitation) {
      return {
        status: "not_found",
        message: "Invitation not found",
        data: [],
      };
    }

    const updatedInvitation = await invitationModel.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
      }
    );

    return {
      status: "ok",
      message: "Invitation updated successfully",
      data: updatedInvitation,
    };
  } catch (error) {
    console.error("Error updating invitation:", error);
    return {
      status: "error",
      message: "An error occurred while updating the invitation",
      data: [],
      error: error.message,
    };
  }
};

// DELETE EXERCISE
export const deleteInvitation = async (id) => {
  try {
    await dbConnect();

    const invitation = await invitationModel.findById(id);
    if (!invitation) {
      return {
        status: "not_found",
        message: "Invitation not found",
        data: [],
      };
    }

    const deletedInvitation = await invitationModel.findByIdAndDelete(id);

    return {
      status: "ok",
      message: "Invitation deleted successfully",
      data: deletedInvitation,
    };
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return {
      status: "error",
      message: "An error occurred while deleting the invitation",
      data: [],
      error: error.message,
    };
  }
};

// GET EXERCISE BY ID
export const getInvitationById = async (id) => {
  try {
    await dbConnect();

    const invitation = await invitationModel.findById(id);

    if (!invitation) {
      return {
        status: "not_found",
        message: "Invitation not found",
        data: [],
      };
    }

    return {
      status: "ok",
      message: "Invitation fetched successfully",
      data: invitation,
    };
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return {
      status: "error",
      message: "An error occurred while fetching the invitation",
      data: [],
      error: error.message,
    };
  }
};
