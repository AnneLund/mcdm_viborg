import express from "express";
import {
  createTeam,
  deleteTeam,
  getTeamById,
  updateTeam,
} from "../../handlers/teams/team.handler.js";
import auth from "../../middleware/auth.middleware.js";
import { isValidObjectId } from "../../helpers/isValidObjectId.js";
import { upload } from "../../helpers/multerUpload.js";

const teamRouter = express.Router();

// CREATE TEAM
teamRouter.post("/", upload.none(), async (req, res) => {
  try {
    const { team, description } = req.body;

    if (!team) {
      return res.status(400).json({
        status: "error",
        message: "Please provide all required fields",
      });
    }
    const teamData = {
      team,
      description,
    };

    const result = await createTeam(teamData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to add team",
      });
    }

    return res.status(201).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Error adding team:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// UPDATE TEAM
teamRouter.put("/:id", auth, upload.none(), async (req, res) => {
  try {
    const { team, description } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "ID is missing",
      });
    }

    const updateData = {
      team,
      description,
    };

    const result = await updateTeam(id, updateData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to update team",
      });
    }

    return res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Fejl i updateTeam:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// DELETE TEAM
teamRouter.delete("/:id", auth, async (req, res) => {
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

    const result = await deleteTeam(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting team:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET TEAM BY ID
teamRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Team ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await getTeamById(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching team:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default teamRouter;
