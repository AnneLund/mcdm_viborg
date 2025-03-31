import express from "express";
import {
  createInvitation,
  deleteInvitation,
  getInvitationById,
  updateInvitation,
} from "../../../handlers/anne/invitations/invitation.handler.js";

import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import auth from "../../../middleware/auth.middleware.js";
import { isValidObjectId } from "../../../helpers/isValidObjectId.js";
import guestModel from "../../../db/models/anne/guest.model.mjs";
import disableCache from "../../../helpers/disableCach.js";

const invitationRouter = express.Router();

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

// POST INVITATION
invitationRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, location, type, date, time, images } = req.body;
    const file = req.file;

    let parsedImages = [];

    if (images) {
      if (typeof images === "string") {
        try {
          parsedImages = JSON.parse(images);
        } catch {
          parsedImages = [images];
        }
      } else if (Array.isArray(images)) {
        parsedImages = images;
      }
    }

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

    const invitationData = {
      title,
      description,
      image: fileUrl,
      images: parsedImages,
      location,
      type,
      date,
      time,
    };

    const result = await createInvitation(invitationData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to add invitation",
      });
    }

    return res.status(201).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Error adding invitation:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Opdater eksisterende projekt
invitationRouter.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, file, location, type, date, time, images } =
      req.body;
    const { id } = req.params;

    if (images) {
      if (typeof images === "string") {
        try {
          parsedImages = JSON.parse(images);
        } catch {
          parsedImages = [images];
        }
      } else if (Array.isArray(images)) {
        parsedImages = images;
      }
    }

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
      file,
      images: parsedImages,
      location,
      type,
      date,
      time,
    };

    if (fileUrl) updateData.file = fileUrl;

    const result = await updateInvitation(id, updateData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to update invitation",
      });
    }

    return res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Error updating invitation:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// DELETE INVITATION
invitationRouter.delete("/:id", async (req, res) => {
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

    const result = await deleteInvitation(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET INVITATION BY ID
invitationRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Invitation ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await getInvitationById(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// HENT EN GÆST VIA TOKEN (fx fra e-mail-link)
invitationRouter.get("/guest/token/:token", async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token mangler" });
    }

    const guest = await guestModel.findOne({ token }).lean();

    if (!guest) {
      return res.status(404).json({ message: "Gæst ikke fundet" });
    }

    return res.status(200).json({ guest });
  } catch (error) {
    console.error("Fejl ved hentning af gæst:", error);
    res.status(500).json({
      message: "Intern serverfejl",
      error: error.message,
    });
  }
});

// GÆSTEN SVARER PÅ INVITATION
invitationRouter.post("/response", async (req, res) => {
  try {
    const { token, isAttending, numberOfGuests } = req.body;

    if (!token || typeof isAttending !== "boolean") {
      return res.status(400).json({ message: "Ugyldige data" });
    }

    const guest = await guestModel.findOne({ token });

    if (!guest) {
      return res.status(404).json({ message: "Gæst ikke fundet" });
    }

    guest.isAttending = isAttending;
    guest.numberOfGuests = isAttending ? numberOfGuests : 0;
    guest.hasResponded = true;

    await guest.save();

    res.status(200).json({ message: "Svar registreret", guest });
  } catch (error) {
    console.error("Fejl ved gem af svar:", error);
    res.status(500).json({
      message: "Kunne ikke gemme svar",
      error: error.message,
    });
  }
});

export default invitationRouter;
