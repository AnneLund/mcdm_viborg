import express from "express";
import { signInUser } from "../../handlers/auth.handler.js";

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

export default authRouter;
