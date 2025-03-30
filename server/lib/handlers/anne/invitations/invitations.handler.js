import dbConnect from "../../../db/dbConnect.js";
import invitationModel from "../../../db/models/anne/invitation.model.mjs";

export const getInvitations = async () => {
  try {
    await dbConnect();

    const invitations = await invitationModel.find({});

    return {
      status: "ok",
      message: "Invitations fetched successfully",
      data: invitations,
    };
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return {
      status: "error",
      message: "An error occurred while fetching invitations",
      data: [],
      error: error.message,
    };
  }
};
