import dbConnect from "../../db/dbConnect.js";
import teamModel from "../../db/models/team.model.mjs";

// CREATE TEAM
export const createTeam = async (body) => {
  try {
    await dbConnect();

    const data = await teamModel.create(body);

    return {
      status: "ok",
      message: "Team created successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error adding team:", error);

    return {
      status: "error",
      message: "An error occurred while creating the team",
      data: [],
      error: error.message,
    };
  }
};

// UPDATE TEAM
export const updateTeam = async (id, body) => {
  try {
    await dbConnect();

    const team = await teamModel.findById(id);

    if (!team) {
      return {
        status: "not_found",
        message: "Team not found",
        data: [],
      };
    }

    const updatedTeam = await teamModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return {
      status: "ok",
      message: "Team updated successfully",
      data: updatedTeam,
    };
  } catch (error) {
    console.error("Error updating team:", error);
    return {
      status: "error",
      message: "An error occurred while updating the team",
      data: [],
      error: error.message,
    };
  }
};

// DELETE TEAM
export const deleteTeam = async (id) => {
  try {
    await dbConnect();

    const team = await teamModel.findById(id);
    if (!team) {
      return {
        status: "not_found",
        message: "Team not found",
        data: [],
      };
    }

    const deletedTeam = await teamModel.findByIdAndDelete(id);

    return {
      status: "ok",
      message: "Team deleted successfully",
      data: deletedTeam,
    };
  } catch (error) {
    console.error("Error deleting team:", error);
    return {
      status: "error",
      message: "An error occurred while deleting the team",
      data: [],
      error: error.message,
    };
  }
};

// GET TEAM BY ID
export const getTeamById = async (id) => {
  try {
    await dbConnect();

    const team = await teamModel.findById(id);

    if (!team) {
      return {
        status: "not_found",
        message: "Team not found",
        data: [],
      };
    }

    return {
      status: "ok",
      message: "Team fetched successfully",
      data: team,
    };
  } catch (error) {
    console.error("Error fetching team:", error);
    return {
      status: "error",
      message: "An error occurred while fetching the team",
      data: [],
      error: error.message,
    };
  }
};
