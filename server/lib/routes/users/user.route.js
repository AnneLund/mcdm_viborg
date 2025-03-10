import express from "express";
import bcrypt from "bcryptjs";
import auth from "../../middleware/auth.middleware.js";

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../../handlers/users/user.handler.js";
import { uploadFileToS3 } from "../../helpers/uploadFileToS3.js";
import { upload } from "../../helpers/multerUpload.js";
import { isValidObjectId } from "../../helpers/isValidObjectId.js";
import teamModel from "../../db/models/team.model.mjs";
import userModel from "../../db/models/user.model.mjs";
import mongoose from "mongoose";

const userRouter = express.Router();

// GET USERS
userRouter.get("/", async (_, res) => {
  try {
    const data = await getUsers();

    if (data.status === "ok") {
      return res.status(200).send({ message: data.message, data: data.data });
    }

    return res.status(500).send({ message: data.message, data: [] });
  } catch (error) {
    console.error("Error in GET /users:", error);
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// CREATE USER
userRouter.post("/", upload.single("picture"), async (req, res) => {
  try {
    const { name, email, role, password, team } = req.body;
    const file = req.file;

    if (!password) {
      return res.status(400).json({ error: "Password er påkrævet" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let fileUrl = file
      ? await uploadFileToS3(file, "mediacollege")
      : "https://keeperzone.nyc3.cdn.digitaloceanspaces.com/mediacollege/1741194439860-no-user.jpg";

    let teamObject = null;
    if (team) {
      const foundTeam = await teamModel.findOne({ team: team });
      if (!foundTeam) {
        return res.status(400).json({ message: "Team not found" });
      }
      teamObject = foundTeam._id;
    }

    const newUser = {
      name,
      email,
      team: teamObject,
      picture: fileUrl,
      role,
      hashedPassword,
    };

    const result = await createUser(newUser);

    if (result.status === "ok") {
      return res
        .status(201)
        .send({ message: result.message, data: result.data });
    } else {
      return res.status(400).send({
        message: result.message,
        data: [],
      });
    }
  } catch (error) {
    console.error("Fejl ved oprettelse af bruger:", error);
    return res
      .status(500)
      .send({ message: "Serverfejl ved oprettelse af bruger." });
  }
});

// UPDATE USER
userRouter.put("/:id", auth, upload.single("picture"), async (req, res) => {
  try {
    const { id } = req.params;
    let { role, name, email, password, team, feedback, picture } = req.body;
    const file = req.file;

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    const userId = isValidObjectId(id);
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID",
      });
    }

    let updatedUser = {};
    if (role) updatedUser.role = role;
    if (name) updatedUser.name = name;
    if (email) updatedUser.email = email;

    // 📌 Håndter team-opdatering
    if (team) {
      if (isValidObjectId(team)) {
        updatedUser.team = team;
      } else {
        const foundTeam = await teamModel.findOne({ team: team });
        if (!foundTeam) {
          return res
            .status(400)
            .json({ status: "error", message: "Team not found" });
        }
        updatedUser.team = foundTeam._id;
      }
    }

    // 📌 Håndter billede-opdatering
    if (file) {
      updatedUser.picture = await uploadFileToS3(file, "mediacollege");
    } else if (picture) {
      updatedUser.picture = picture; // Behold det eksisterende billede
    } else {
      // Hvis der ikke er en ny fil og ikke et eksisterende billede, brug standard
      updatedUser.picture =
        "https://keeperzone.nyc3.cdn.digitaloceanspaces.com/mediacollege/1741194439860-no-user.jpg";
    }

    // 📌 Hash nyt password, hvis det er ændret
    if (password) {
      updatedUser.hashedPassword = await bcrypt.hash(password, 10);
    }

    // 📌 Håndter feedback-felt
    if (feedback) {
      try {
        updatedUser.feedback = JSON.parse(feedback);
      } catch (error) {
        return res.status(400).json({
          status: "error",
          message: "Invalid feedback format. Expected JSON.",
        });
      }
    }

    const result = await updateUser(userId, updatedUser);

    if (result.status === "not_found") {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (result.status === "error") {
      return res.status(500).json({ status: "error", message: result.message });
    }

    return res.status(200).json({
      status: "ok",
      message: "User updated successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Fejl ved opdatering af bruger:", error);
    return res.status(500).json({
      status: "error",
      message: "Serverfejl ved opdatering af bruger.",
    });
  }
});

// UPDATE USER FEEDBACK
userRouter.put("/:id/feedback", async (req, res) => {
  try {
    const { id } = req.params; // Bruger-ID
    const { feedbackId, feedback } = req.body; // Evt. feedback-ID for opdatering

    if (!feedback || typeof feedback !== "object") {
      return res.status(400).json({ message: "Feedback skal være et objekt" });
    }

    let updatedUser;

    if (feedbackId) {
      // **Opdater eksisterende feedback**
      updatedUser = await userModel.findOneAndUpdate(
        { _id: id, "feedback._id": feedbackId },
        {
          $set: {
            "feedback.$.project": feedback.project || null,
            "feedback.$.exercise": feedback.exercise || null,
            "feedback.$.projectComments": feedback.projectComments || [],
            "feedback.$.focusPoints": feedback.focusPoints || [],
            "feedback.$.date": new Date(),
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Feedback ikke fundet" });
      }

      res.json({ message: "Feedback opdateret", user: updatedUser });
    } else {
      // **Tilføj ny feedback**
      updatedUser = await userModel.findByIdAndUpdate(
        id,
        { $push: { feedback } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Bruger ikke fundet" });
      }

      res.json({ message: "Feedback tilføjet", user: updatedUser });
    }
  } catch (error) {
    console.error("Fejl ved tilføjelse/opdatering af feedback:", error);
    res.status(500).json({ message: "Serverfejl ved håndtering af feedback" });
  }
});

// DELETE USER
userRouter.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "No ID provided" });
    }

    const userId = isValidObjectId(id);
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID",
        data: [],
      });
    }

    const result = await deleteUser(userId);

    if (result.status === "ok") {
      return res.status(200).json({ message: result.message });
    }

    return res.status(400).json({ message: result.message });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting user" });
  }
});

// GET USER BY ID
userRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "No ID provided" });
    }

    const userId = isValidObjectId(id);
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID",
        data: [],
      });
    }

    const result = await getUserById(userId);

    if (result.status === "ok") {
      return res
        .status(200)
        .json({ message: result.message, data: result.data });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching user" });
  }
});

// GET USERS BY TEAM
userRouter.get("/team/:teamId", auth, async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!isValidObjectId(teamId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid team ID" });
    }

    const team = await teamModel.findById(teamId);
    if (!team) {
      return res
        .status(404)
        .json({ status: "error", message: "Team not found" });
    }

    const users = await userModel.find({ team: teamId });

    return res.status(200).json({
      status: "ok",
      message: `Users and team info for team ${teamId}`,
      team,
      users,
    });
  } catch (error) {
    console.error("Fejl ved hentning af brugere og team:", error);
    return res.status(500).json({
      status: "error",
      message: "Serverfejl ved hentning af brugere og team.",
    });
  }
});

export default userRouter;
