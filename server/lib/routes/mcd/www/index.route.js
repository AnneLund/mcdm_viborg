import express from "express";
import { assignmentSettings } from "../../../db/mcd/misc/settings.js";

const indexRouter = express.Router();

// API route to get assignment settings
indexRouter.get("/", (req, res) => {
  console.log("GET /api");
  res.json(assignmentSettings);
});

export default indexRouter;
