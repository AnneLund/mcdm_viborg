import express from "express";
import { getExercises } from "../../handlers/exercises/exercises.handler.js";

const exercisesRouter = express.Router();

// Get exercises
exercisesRouter.get("/", async (req, res) => {
  try {
    const data = await getExercises();

    if (data.status === "ok") {
      return res.status(200).send({ message: data.message, data: data.data });
    }

    return res.status(500).send({ message: data.message, data: [] });
  } catch (error) {
    console.error("Error in GET /exercises:", error);
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default exercisesRouter;
