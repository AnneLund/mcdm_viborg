import express from "express";
import { getProjects } from "../../handlers/projects/projects.handler.js";

const projectsRouter = express.Router();

// Get projects
projectsRouter.get("/", async (req, res) => {
  try {
    const data = await getProjects();

    if (data.status === "ok") {
      return res.status(200).send({ message: data.message, data: data.data });
    }

    return res.status(500).send({ message: data.message, data: [] });
  } catch (error) {
    console.error("Error in GET /projects:", error);
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default projectsRouter;
