import express from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  updateProject,
} from "../../handlers/projects/project.handler.js";
import auth from "../../middleware/auth.middleware.js";
import mongoose from "mongoose";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import projectModel from "../../db/models/project.model.mjs";

const projectRouter = express.Router();

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
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://keeperzone.nyc3.cdn.digitaloceanspaces.com/${filePath}`;
  } catch (error) {
    console.error("Fejl ved upload til S3:", error);
    return null;
  }
};

// POST PROJECT
projectRouter.post(
  "/",
  upload.fields([
    { name: "materialsZip", maxCount: 1 },
    { name: "serverZip", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, figma, isVisible } = req.body;
      const materialsZipFile = req.files["materialsZip"]?.[0] || null;
      const serverZipFile = req.files["serverZip"]?.[0] || null;

      if (!title) {
        return res.status(400).json({
          status: "error",
          message: "Please provide all required fields",
        });
      }

      const materialsZipUrl = await uploadFileToS3(
        materialsZipFile,
        "mediacollege"
      );
      const serverZipUrl = await uploadFileToS3(serverZipFile, "mediacollege");

      const projectData = {
        title,
        description,
        figma,
        isVisible: isVisible === "true",
        materialsZip: materialsZipUrl,
        serverZip: serverZipUrl,
      };

      const result = await createProject(projectData);

      if (!result || result.status !== "ok") {
        return res.status(500).json({
          status: "error",
          message: result.message || "Failed to add project",
        });
      }

      return res.status(201).json({ status: "ok", data: result });
    } catch (error) {
      console.error("Error adding project:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

// Opdater eksisterende projekt
projectRouter.put(
  "/:id",
  auth,
  upload.fields([
    { name: "materialsZip", maxCount: 1 },
    { name: "serverZip", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, figma, isVisible } = req.body;
      const { id } = req.params;

      const materialsZipFile = req.files["materialsZip"]?.[0] || null;
      const serverZipFile = req.files["serverZip"]?.[0] || null;

      if (!title) {
        return res.status(400).json({
          status: "error",
          message: "Title is required",
        });
      }
      const materialsZipUrl = materialsZipFile
        ? await uploadFileToS3(materialsZipFile, "mediacollege")
        : null;
      const serverZipUrl = serverZipFile
        ? await uploadFileToS3(serverZipFile, "mediacollege")
        : null;

      const updateData = {
        title,
        description,
        figma,
        isVisible: isVisible === "true",
      };

      if (materialsZipUrl) updateData.materialsZip = materialsZipUrl;
      if (serverZipUrl) updateData.serverZip = serverZipUrl;

      const result = await updateProject(id, updateData);

      if (!result || result.status !== "ok") {
        return res.status(500).json({
          status: "error",
          message: result.message || "Failed to update project",
        });
      }

      return res.status(200).json({ status: "ok", data: result });
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

// HANDLE PROJECT VISIBILITY
projectRouter.put("/:id/visibility", async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible } = req.body;

    if (!isValidObjectId(id)) return;

    const project = await projectModel.findByIdAndUpdate(
      id,
      { isVisible: isVisible },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Projekt ikke fundet" });
    }

    return res.status(200).json({ status: "ok", data: project });
  } catch (error) {
    res.status(500).json({
      message: "Fejl ved opdatering af synlighed",
      error: error.message,
    });
  }
});

// DELETE PROJECT
projectRouter.delete("/:id", auth, async (req, res) => {
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

    const result = await deleteProject(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET PROJECT BY ID
projectRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Project ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await getProjectById(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default projectRouter;
