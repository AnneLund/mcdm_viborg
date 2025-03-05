import express from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  updateEvent,
} from "../../handlers/events/event.handler.js";
import auth from "../../middleware/auth.middleware.js";
import mongoose from "mongoose";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const eventRouter = express.Router();

const isValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Invalid ObjectId: ${id}`);
    return false;
  }
  return true;
};

const s3Client = new S3Client({
  endpoint: "https://nyc3.digitaloceanspaces.com",
  region: "nyc3",
  credentials: {
    accessKeyId: process.env.DO_ACCESS_KEY,
    secretAccessKey: process.env.DO_SECRET_KEY,
  },
});

const upload = multer({ storage: multer.memoryStorage() });

const uploadFileToS3 = async (file, folder) => {
  if (!file) return null; // Hvis ingen fil er valgt, returnér null

  const fileName = `${Date.now()}-${file.originalname}`; // Unikt filnavn
  const filePath = `${folder}/${fileName}`;

  const params = {
    Bucket: "keeperzone",
    Key: filePath,
    Body: file.buffer,
    ACL: "public-read",
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://keeperzone.nyc3.cdn.digitaloceanspaces.com/${filePath}`;
  } catch (error) {
    console.error("Fejl ved upload til S3:", error);
    return null; // Hvis upload fejler, returnér null
  }
};

// POST EVENT
eventRouter.post("/", upload.none(), async (req, res) => {
  try {
    const { event, description, presentation, date, time, file } = req.body;

    if (!event) {
      return res.status(400).json({
        status: "error",
        message: "Please provide all required fields",
      });
    }
    const eventData = {
      event,
      description,
      presentation,
      date,
      time,
      file,
    };

    const result = await createEvent(eventData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to add event",
      });
    }

    return res.status(201).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Error adding event:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Opdater eksisterende projekt
eventRouter.put("/:id", auth, upload.none(), async (req, res) => {
  try {
    const { event, description, presentation, date, time, file } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "ID is missing",
      });
    }

    const updateData = {
      event,
      description,
      presentation,
      date,
      time,
      file,
    };

    const result = await updateEvent(id, updateData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to update event",
      });
    }

    return res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    console.error("🚨 Fejl i updateEvent:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// DELETE EVENT
eventRouter.delete("/:id", auth, async (req, res) => {
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

    const result = await deleteEvent(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET EVENT BY ID
eventRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Event ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await getEventById(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default eventRouter;
