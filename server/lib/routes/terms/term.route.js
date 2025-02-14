import express from "express";
import {
  addTerm,
  deleteTerm,
  getTermById,
  updateTerm,
} from "../../handlers/terms/term.handler.js";
import auth from "../../middleware/auth.middleware.js";
import mongoose from "mongoose";

const termRouter = express.Router();

const isValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Invalid ObjectId: ${id}`);
    return false;
  }
  return true;
};

// POST TERM
termRouter.post("/", auth, async (req, res) => {
  try {
    const { term, definition } = req.body;

    if (!term || !definition) {
      return res.status(400).send({
        status: "error",
        message: "Please provide all required fields",
        data: [],
      });
    }

    const model = { term, definition };

    const result = await addTerm(model);

    if (!result || result.status !== "ok") {
      return res.status(500).send({
        status: "error",
        message: result.message || "Failed to add term",
        data: [],
      });
    }

    return res.status(201).send({ ...result });
  } catch (error) {
    console.error("Error adding term:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// PUT TERM
termRouter.put("/", auth, async (req, res) => {
  try {
    const { id, term, definition } = req.body;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Term ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const model = { id, term, definition };

    const result = await updateTerm(model);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error updating term:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// DELETE TERM
termRouter.delete("/:id", auth, async (req, res) => {
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

    const result = await deleteTerm(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting term:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET TERM BY ID
termRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Term ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await getTermById(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching term:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default termRouter;
