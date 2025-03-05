import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";

import * as mime from "mime-types";

import auth from "../../middleware/auth.middleware.js";
import { getNewUID } from "../../db/mcd/misc/helpers.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import {
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from "../../handlers/user.handler.js";
import mongoose from "mongoose";

const userRouter = express.Router();

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

// POST
userRouter.post("/", upload.single("picture"), async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const file = req.file;

    if (!password) {
      return res.status(400).json({ error: "Password er påkrævet" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let fileUrl = null;
    if (file) {
      fileUrl = await uploadFileToS3(file, "mediacollege");
    }

    const newUser = {
      name,
      email,
      picture: fileUrl,
      role,
      hashedPassword: hashedPassword,
    };

    const result = await createUser(newUser);

    if (result.status === "ok") {
      return res
        .status(201)
        .send({ message: result.message, data: result.data });
    } else {
      return res.status(400).send({
        message: result.message,
        data: [],
      });
    }
  } catch (error) {
    console.error("Fejl ved oprettelse af bruger:", error);
    return res
      .status(500)
      .send({ message: "Serverfejl ved oprettelse af bruger." });
  }
});

userRouter.put("/", auth, upload.single("picture"), async (req, res) => {
  try {
    let { id, role, name, email, password, picture } = req.body;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "User ID is required",
        data: [],
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid user ID",
        data: [],
      });
    }

    let updatedUser = {
      id,
      role,
      name,
      email,
      password,
      picture,
    };

    if (password) {
      updatedUser.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updatedUser.picture = await uploadFileToS3(req.file, "mediacollege");
    }

    let result = await updateUser(updatedUser);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Fejl ved opdatering af bruger:", error);
    return res.status(500).send({
      message: "Serverfejl ved opdatering af bruger.",
    });
  }
});

// DELETE
userRouter.delete("/:id", auth, async (req, res) => {
  if (!req.params.id) {
    return res.status(200).send({ message: "No ID provided", data: {} });
  }

  let result = await deleteUser(req.params.id);

  if (result.status === "ok") {
    return res.status(200).send({ message: result.message, data: [] });
  } else {
    return res.status(400).send({ message: result.message, data: {} });
  }
});

// GET By ID
userRouter.get("/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(200).send({ message: "No ID provided", data: {} });
  }

  let result = await getUserById(req.params.id);

  if (result.status === "ok") {
    return res.status(200).send({ message: result.message, data: result.data });
  } else {
    return res.status(200).send({ message: result.message, data: {} });
  }
});

export default userRouter;
