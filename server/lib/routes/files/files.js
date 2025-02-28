import dotenv from "dotenv";
dotenv.config();
import express from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const upload = multer();
const fileRouter = express.Router();

const s3Client = new S3Client({
  endpoint: "https://nyc3.digitaloceanspaces.com",
  region: "nyc3",
  credentials: {
    accessKeyId: process.env.DO_ACCESS_KEY,
    secretAccessKey: process.env.DO_SECRET_KEY,
  },
});

// Upload single file
fileRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Ingen fil modtaget" });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`; // Unik filnavngivning

    const params = {
      Bucket: "keeperzone",
      Key: `mediacollege/${fileName}`,
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const fileUrl = `https://keeperzone.nyc3.cdn.digitaloceanspaces.com/mediacollege/${fileName}`;
    res.status(200).json({ fileUrl });
  } catch (error) {
    console.error("Fejl ved upload:", error);
    res.status(500).json({ error: "Fejl ved upload af fil" });
  }
});

// Upload multiple files
fileRouter.post("/multiple", upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Ingen filer modtaget" });
    }

    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const fileName = `${Date.now()}-${file.originalname}`;

        const params = {
          Bucket: "keeperzone",
          Key: `mediacollege/${fileName}`,
          Body: file.buffer,
          ACL: "public-read",
          ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return {
          fileName: file.originalname,
          fileUrl: `https://keeperzone.nyc3.cdn.digitaloceanspaces.com/mediacollege/${fileName}`,
        };
      })
    );

    res.status(200).json({ uploadedFiles });
  } catch (error) {
    console.error("Fejl ved upload af filer:", error);
    res.status(500).json({ error: "Fejl ved upload af filer" });
  }
});

export default fileRouter;
