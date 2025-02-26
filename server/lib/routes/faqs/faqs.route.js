import express from "express";
import { getFaqs } from "../../handlers/faqs/faqs.handler.js";

const faqsRouter = express.Router();

// Get faqs
faqsRouter.get("/", async (req, res) => {
  try {
    const data = await getFaqs();

    if (data.status === "ok") {
      return res.status(200).send({ message: data.message, data: data.data });
    }

    return res.status(500).send({ message: data.message, data: [] });
  } catch (error) {
    console.error("Error in GET /faqs:", error);
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default faqsRouter;
