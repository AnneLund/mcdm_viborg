import express from "express";
import { changePassword, signInUser } from "../../handlers/auth.handler.js";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tjek om email og password er angivet
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email og adgangskode er påkrævet.",
      });
    }

    const result = await signInUser(req.body);

    if (result.status === "error") {
      if (result.message.includes("Forkert adgangskode")) {
        return res.status(401).json(result);
      }
      if (result.message.includes("Brugeren findes ikke")) {
        return res.status(404).json(result);
      }
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Fejl ved login:", error);
    return res.status(500).json({
      status: "error",
      message: "Der opstod en serverfejl under login. Prøv igen senere.",
    });
  }
});

authRouter.post("/change-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Verificer om vi har en 'Authorization' header med JWT
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Dekod JWT-tokenet og få fat i brugerens ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    const result = await changePassword(userId, currentPassword, newPassword);

    if (result.status === "error") {
      return res.status(result.code).json({ message: result.message });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default authRouter;
