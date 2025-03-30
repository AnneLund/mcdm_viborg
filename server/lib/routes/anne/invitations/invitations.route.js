import express from "express";
import { getInvitations } from "../../../handlers/anne/invitations/invitations.handler.js";

const invitationsRouter = express.Router();

// Get invitations
invitationsRouter.get("/", async (req, res) => {
  try {
    const data = await getInvitations();

    if (data.status === "ok") {
      return res.status(200).send({ message: data.message, data: data.data });
    }

    return res.status(500).send({ message: data.message, data: [] });
  } catch (error) {
    console.error("Error in GET /invitations:", error);
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default invitationsRouter;
