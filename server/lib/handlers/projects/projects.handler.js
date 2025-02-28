import dbConnect from "../../db/dbConnect.js";
import projectModel from "../../db/models/project.model.mjs";

export const getProjects = async () => {
  try {
    await dbConnect();

    const projects = await projectModel.find({});

    return {
      status: "ok",
      message: "Projects fetched successfully",
      data: projects,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      status: "error",
      message: "An error occurred while fetching projects",
      data: [],
      error: error.message,
    };
  }
};
