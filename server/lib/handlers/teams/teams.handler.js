import dbConnect from "../../db/dbConnect.js";
import teamModel from "../../db/models/team.model.mjs";

export const getTeams = async () => {
  try {
    await dbConnect();

    const teams = await teamModel.find({});

    return {
      status: "ok",
      message: "Teams fetched successfully",
      data: teams,
    };
  } catch (error) {
    console.error("Error fetching teams:", error);
    return {
      status: "error",
      message: "An error occurred while fetching teams",
      data: [],
      error: error.message,
    };
  }
};
