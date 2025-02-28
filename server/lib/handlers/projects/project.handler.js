import dbConnect from "../../db/dbConnect.js";
import projectModel from "../../db/models/project.model.mjs";

// ADD PROJECT
export const createProject = async (body) => {
  try {
    await dbConnect();

    const data = await projectModel.create(body);

    return {
      status: "ok",
      message: "Project created successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error adding project:", error);

    return {
      status: "error",
      message: "An error occurred while creating the project",
      data: [],
      error: error.message,
    };
  }
};

// UPDATE PROJECT
export const updateProject = async (body) => {
  try {
    await dbConnect();

    const project = await projectModel.findById(body.id);
    if (!project) {
      return {
        status: "not_found",
        message: "Project not found",
        data: [],
      };
    }
    const updatedProject = await projectModel.findByIdAndUpdate(body.id, body, {
      new: true,
    });

    return {
      status: "ok",
      message: "Project updated successfully",
      data: updatedProject,
    };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      status: "error",
      message: "An error occurred while updating the project",
      data: [],
      error: error.message,
    };
  }
};

// DELETE PROJECT
export const deleteProject = async (id) => {
  try {
    await dbConnect();

    const project = await projectModel.findById(id);
    if (!project) {
      return {
        status: "not_found",
        message: "Project not found",
        data: [],
      };
    }

    const deletedProject = await projectModel.findByIdAndDelete(id);

    return {
      status: "ok",
      message: "Project deleted successfully",
      data: deletedProject,
    };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      status: "error",
      message: "An error occurred while deleting the project",
      data: [],
      error: error.message,
    };
  }
};

// GET PROJECT BY ID
export const getProjectById = async (id) => {
  try {
    await dbConnect();

    const project = await projectModel.findById(id);

    if (!project) {
      return {
        status: "not_found",
        message: "Project not found",
        data: [],
      };
    }

    return {
      status: "ok",
      message: "Project fetched successfully",
      data: project,
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return {
      status: "error",
      message: "An error occurred while fetching the project",
      data: [],
      error: error.message,
    };
  }
};
