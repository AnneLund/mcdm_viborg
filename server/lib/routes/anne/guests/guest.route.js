import express from "express";
import {
  createGuest,
  deleteGuest,
  getGuestById,
  updateGuest,
} from "../../../handlers/anne/guests/guest.handler.js";
import { isValidObjectId } from "../../../helpers/isValidObjectId.js";
import { upload } from "../../../helpers/multerUpload.js";
import mongoose from "mongoose";

const guestRouter = express.Router();

// CREATE GUEST
guestRouter.post("/", upload.none(), async (req, res) => {
  try {
    const {
      name,
      description,
      token,
      hasResponded,
      isAttending,
      numberOfGuests,
      dateResponded,
      expiresAt,
      invitationId,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Please provide all required fields",
      });
    }
    const guestData = {
      name,
      description,
      token,
      hasResponded,
      isAttending,
      numberOfGuests,
      dateResponded,
      expiresAt,
      invitationId,
    };

    const result = await createGuest(guestData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to add guest",
      });
    }

    return res.status(201).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Error adding guest:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// UPDATE GUEST
guestRouter.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const {
      name,
      description,
      token,
      hasResponded,
      isAttending,
      numberOfGuests,
      dateResponded,
      expiresAt,
      invitationId,
    } = req.body;
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or missing ID",
      });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const updateData = {
      name,
      description,
      token,
      hasResponded,
      isAttending,
      numberOfGuests,
      dateResponded,
      expiresAt,
      invitationId,
    };

    const result = await updateGuest(objectId, updateData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to update guest",
      });
    }

    return res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Fejl i updateGuest:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// DELETE GUEST
guestRouter.delete("/:id", async (req, res) => {
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

    const result = await deleteGuest(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting guest:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET GUEST BY ID
guestRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Guest ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await getGuestById(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching guest:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default guestRouter;
