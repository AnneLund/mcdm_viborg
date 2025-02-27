import express from "express";
import {
  addFaq,
  deleteFaq,
  getFaqById,
  updateFaq,
} from "../../handlers/faqs/faq.handler.js";
import auth from "../../middleware/auth.middleware.js";
import mongoose from "mongoose";

const faqRouter = express.Router();

const isValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Invalid ObjectId: ${id}`);
    return false;
  }
  return true;
};

// POST TERM
faqRouter.post("/", auth, async (req, res) => {
  try {
    const { question, answer, link } = req.body;

    if (!question) {
      return res.status(400).send({
        status: "error",
        message: "Please provide all required fields",
        data: [],
      });
    }

    const model = { question, answer, link };

    const result = await addFaq(model);

    if (!result || result.status !== "ok") {
      return res.status(500).send({
        status: "error",
        message: result.message || "Failed to add faq",
        data: [],
      });
    }

    return res.status(201).send({ ...result });
  } catch (error) {
    console.error("Error adding faq:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// PUT TERM
faqRouter.put("/", auth, async (req, res) => {
  try {
    const { id, question, answer, link } = req.body;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Faq ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const model = { id, question, answer, link };

    const result = await updateFaq(model);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error updating faq:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// DELETE TERM
faqRouter.delete("/:id", auth, async (req, res) => {
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

    const result = await deleteFaq(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting faq:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET TERM BY ID
faqRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Faq ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await getFaqById(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching faq:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default faqRouter;
