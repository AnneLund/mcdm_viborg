import express from "express";
import { getUsers } from "../../handlers/user.handler.js";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    const data = await getUsers();

    if (data.status === "ok") {
      return res.status(200).json({ message: data.message, data: data.data });
    } else {
      return res.status(400).json({ message: data.message, data: [] });
    }
  } catch (error) {
    console.error("Fejl ved hentning af brugere:", error);
    return res
      .status(500)
      .json({ message: "Serverfejl ved hentning af brugere." });
  }
});

export default usersRouter;
