import express from "express";
import { getTerms } from "../../handlers/terms/terms.handler.js";

const termsRouter = express.Router();

// Get terms
termsRouter.get("/", async (req, res) => {
  try {
    const data = await getTerms();

    if (data.status === "ok") {
      return res.status(200).send({ message: data.message, data: data.data });
    }

    return res.status(500).send({ message: data.message, data: [] });
  } catch (error) {
    console.error("Error in GET /terms:", error);
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default termsRouter;
