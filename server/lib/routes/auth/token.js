import express from "express";
import multer from "multer";
import { signInWithToken } from "../../handlers/auth.handler.js";

const authTokenRouter = express.Router();
const upload = multer();

authTokenRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: "error",
        message: "Token er påkrævet.",
      });
    }

    const result = await signInWithToken(token);

    if (result.status === "error") {
      return res.status(401).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Fejl ved token-login:", error);
    return res.status(500).json({
      status: "error",
      message: "Serverfejl ved token-login. Prøv igen senere.",
    });
  }
});

export default authTokenRouter;
