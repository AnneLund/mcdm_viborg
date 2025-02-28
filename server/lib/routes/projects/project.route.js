import express from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  updateProject,
} from "../../handlers/projects/project.handler.js";
import auth from "../../middleware/auth.middleware.js";
import mongoose from "mongoose";

const projectRouter = express.Router();

const isValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Invalid ObjectId: ${id}`);
    return false;
  }
  return true;
};

// POST PROJECT
projectRouter.post("/", auth, async (req, res) => {
  try {
    const { title, zip, figma, server, isVisible } = req.body;

    if (!title) {
      return res.status(400).send({
        status: "error",
        message: "Please provide all required fields",
        data: [],
      });
    }

    const model = { title, zip, figma, server, isVisible };

    const result = await createProject(model);

    if (!result || result.status !== "ok") {
      return res.status(500).send({
        status: "error",
        message: result.message || "Failed to add project",
        data: [],
      });
    }

    return res.status(201).send({ ...result });
  } catch (error) {
    console.error("Error adding project:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// PUT PROJECT
projectRouter.put("/", auth, async (req, res) => {
  try {
    const { id, title, zip, figma, server, isVisible } = req.body;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Project ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const model = { id, title, zip, figma, server, isVisible };

    const result = await updateProject(model);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// DELETE PROJECT
projectRouter.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "No ID provided",
        data: {},
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await deleteProject(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET PROJECT BY ID
projectRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Project ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await getProjectById(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default projectRouter;
