import express from "express";
import { getGuests } from "../../../handlers/anne/guests/guests.handler.js";
import guestModel from "../../../db/models/anne/guest.model.mjs";

const guestsRouter = express.Router();

// Get guests
guestsRouter.get("/", async (req, res) => {
  try {
    const data = await getGuests();

    if (data.status === "ok") {
      return res.status(200).send({ message: data.message, data: data.data });
    }

    return res.status(500).send({ message: data.message, data: [] });
  } catch (error) {
    console.error("Error in GET /guests:", error);
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

guestsRouter.get("/by-invitation/:invitationId", async (req, res) => {
  try {
    const { invitationId } = req.params;

    if (!invitationId) {
      return res.status(400).json({ message: "Invitation ID mangler" });
    }

    const guests = await guestModel.find({ invitationId });

    res.status(200).json({ guests });
  } catch (error) {
    console.error("Fejl i GET /guests/by-invitation/:invitationId:", error);
    res.status(500).json({
      message: "Intern serverfejl",
      error: error.message,
    });
  }
});

export default guestsRouter;
