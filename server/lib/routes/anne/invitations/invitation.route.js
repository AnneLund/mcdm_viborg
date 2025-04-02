import express from "express";
import {
  createInvitation,
  deleteInvitation,
  getInvitationById,
  updateInvitation,
} from "../../../handlers/anne/invitations/invitation.handler.js";

import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { isValidObjectId } from "../../../helpers/isValidObjectId.js";
import guestModel from "../../../db/models/anne/guest.model.mjs";
import invitationModel from "../../../db/models/anne/invitation.model.mjs";

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

// Opdater eksisterende invitation
invitationRouter.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      file,
      location,
      type,
      date,
      time,
      images,
      $inc,
    } = req.body;

    const { id } = req.params;

    let updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (location) updateData.location = location;
    if (type) updateData.type = type;
    if (date) updateData.date = date;
    if (time) updateData.time = time;

    let parsedImages = [];

    if (images) {
      if (typeof images === "string") {
        try {
          parsedImages = JSON.parse(images);
        } catch {
          parsedImages = [images];
        }
        updateData.images = parsedImages;
      } else if (Array.isArray(images)) {
        updateData.images = images;
      }
    }

    if (file) {
      const fileUrl = await uploadFileToS3(file, "mediacollege");
      if (fileUrl) updateData.file = fileUrl;
    }

    // Håndter $inc (f.eks. { $inc: { numberOfGuests: 1 } })
    if ($inc && typeof $inc === "object") {
      updateData = { ...updateData, $inc };
    }

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
invitationRouter.delete("/guest/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ status: "error", message: "Ugyldigt ID" });
    }

    const guest = await guestModel.findById(id);

    if (!guest) {
      return res
        .status(404)
        .json({ status: "error", message: "Gæst ikke fundet" });
    }

    const { invitationId, isAttending, numberOfGuests } = guest;

    await guestModel.findByIdAndDelete(id);

    if (isAttending && numberOfGuests > 0 && invitationId) {
      await invitationModel.findByIdAndUpdate(invitationId, {
        $inc: { numberOfGuests: -numberOfGuests },
      });
    }

    return res.status(200).json({ status: "ok", message: "Gæst slettet" });
  } catch (error) {
    console.error("Fejl ved sletning af gæst:", error);
    res
      .status(500)
      .json({ status: "error", message: "Serverfejl", error: error.message });
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

invitationRouter.get("/guest/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const guest = await guestModel.findOne({ token });

    if (!guest) {
      return res.status(404).send("Gæst ikke fundet");
    }

    const inviteUrl = `${process.env.VITE_API_URL}/invitation/guest/${token}`;
    const imageUrl =
      "https://keeperzone.nyc3.cdn.digitaloceanspaces.com/40th.jpg";
    const name = guest.name;
    const title = `Invitation til ${name}`;
    const description = `🎉 Du er inviteret til et særligt arrangement! Klik for at se din personlige invitation.`;

    res.set("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html lang="da">
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${inviteUrl}" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
          <script>
            window.location.href = "${inviteUrl}";
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Fejl ved rendering af preview-side:", err);
    res.status(500).send("Noget gik galt.");
  }
});

// GÆSTEN SVARER PÅ INVITATION
invitationRouter.post("/response", async (req, res) => {
  try {
    const { token, isAttending, numberOfGuests, description, dateResponded } =
      req.body;

    if (!token || typeof isAttending !== "boolean") {
      return res.status(400).json({ message: "Ugyldige data" });
    }

    const guest = await guestModel.findOne({ token });

    if (!guest) {
      return res.status(404).json({ message: "Gæst ikke fundet" });
    }

    const previousAttending = guest.isAttending;
    const previousCount = guest.numberOfGuests || 0;
    const invitationId = guest.invitationId;

    guest.isAttending = isAttending;
    guest.numberOfGuests = numberOfGuests;
    guest.hasResponded = true;
    guest.description = description;
    guest.dateResponded = dateResponded;

    await guest.save();

    // 💥 Justér antal gæster i invitation
    if (invitationId) {
      let delta = 0;

      if (previousAttending && !isAttending) {
        // Går fra at deltage til ikke at deltage
        delta = -previousCount;
      } else if (!previousAttending && isAttending) {
        // Går fra ikke at deltage til at deltage
        delta = numberOfGuests;
      } else if (
        previousAttending &&
        isAttending &&
        previousCount !== numberOfGuests
      ) {
        // Deltager stadig, men antal er ændret
        delta = numberOfGuests - previousCount;
      }

      if (delta !== 0) {
        await invitationModel.findByIdAndUpdate(invitationId, {
          $inc: { numberOfGuests: delta },
        });
      }
    }

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
