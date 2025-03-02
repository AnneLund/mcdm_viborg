import express from "express";
import {
  createExercise,
  deleteExercise,
  getExerciseById,
  updateExercise,
} from "../../handlers/exercises/exercise.handler.js";
import auth from "../../middleware/auth.middleware.js";
import mongoose from "mongoose";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const exerciseRouter = express.Router();

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
  if (!file) return null;

  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = `${folder}/${fileName}`;

  const params = {
    Bucket: "keeperzone",
    Key: filePath,
    Body: file.buffer,
    ACL: "public-read",
    ContentType: file.mimetype,
    ContentDisposition: "attachment",
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://keeperzone.nyc3.cdn.digitaloceanspaces.com/${filePath}`;
  } catch (error) {
    console.error("Fejl ved upload til S3:", error);
    return null;
  }
};

// POST EXERCISE
exerciseRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!title) {
      return res.status(400).json({
        status: "error",
        message: "Please provide all required fields",
      });
    }
    let fileUrl = null;
    if (file) {
      fileUrl = await uploadFileToS3(file, "mediacollege");
    }

    const exerciseData = {
      title,
      description,
      file: fileUrl,
    };

    const result = await createExercise(exerciseData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to add exercise",
      });
    }

    return res.status(201).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Error adding exercise:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Opdater eksisterende projekt
exerciseRouter.put("/:id", auth, upload.single("file"), async (req, res) => {
  try {
    const { title, description, file } = req.body;
    const { id } = req.params;

    if (!title) {
      return res.status(400).json({
        status: "error",
        message: "Title is required",
      });
    }
    const fileUrl = file ? await uploadFileToS3(fileUrl, "mediacollege") : null;

    const updateData = {
      title,
      description,
    };

    if (fileUrl) updateData.file = fileUrl;

    const result = await updateExercise(id, updateData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to update exercise",
      });
    }

    return res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Error updating exercise:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// DELETE EXERCISE
exerciseRouter.delete("/:id", auth, async (req, res) => {
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

    const result = await deleteExercise(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET EXERCISE BY ID
exerciseRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Exercise ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await getExerciseById(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default exerciseRouter;
