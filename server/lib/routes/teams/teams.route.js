import express from "express";
import { getTeams } from "../../handlers/teams/teams.handler.js";

const teamsRouter = express.Router();

// Get teams
teamsRouter.get("/", async (req, res) => {
  try {
    const data = await getTeams();

    if (data.status === "ok") {
      return res.status(200).send({ message: data.message, data: data.data });
    }

    return res.status(500).send({ message: data.message, data: [] });
  } catch (error) {
    console.error("Error in GET /teams:", error);
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default teamsRouter;
