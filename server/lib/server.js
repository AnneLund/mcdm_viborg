import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import * as url from "url";
import connectDB from "./db/dbConnect.js";

// Routes
import indexRouter from "./routes/mcd/www/index.route.js";
import authRouter from "./routes/auth/auth.js";
import { Server } from "socket.io";
import { createServer } from "http";
import termsRouter from "./routes/terms/terms.route.js";
import termRouter from "./routes/terms/term.route.js";
import faqRouter from "./routes/faqs/faq.route.js";
import faqsRouter from "./routes/faqs/faqs.route.js";
import projectRouter from "./routes/projects/project.route.js";
import projectsRouter from "./routes/projects/projects.route.js";
import fileRouter from "./routes/files/files.js";
import exercisesRouter from "./routes/exercises/exercises.route.js";
import exerciseRouter from "./routes/exercises/exercise.route.js";
import authTokenRouter from "./routes/auth/token.js";
import uploadRouter from "./routes/upload.route.js";
import eventRouter from "./routes/events/event.route.js";
import eventsRouter from "./routes/events/events.route.js";
import userRouter from "./routes/users/user.route.js";
import teamsRouter from "./routes/teams/teams.route.js";
import teamRouter from "./routes/teams/team.route.js";
import guestRouter from "./routes/anne/guests/guest.route.js";
import guestsRouter from "./routes/anne/guests/guests.route.js";
import overviewRouter from "./routes/anne/guests/overview.js";
import invitationsRouter from "./routes/anne/invitations/invitations.route.js";
import invitationRouter from "./routes/anne/invitations/invitation.route.js";

// Opsætning af Express
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5176",
      "https://mcd-viborg-om232.ondigitalocean.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const clientDistPath = path.join(__dirname, "../../client/dist");

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5176",
      "https://mcd-viborg-om232.ondigitalocean.app",
      "https://mcd-viborg-om232.ondigitalocean.app/api",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(clientDistPath));

// Caching-middleware
app.use("/public", (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// Statisk fil-servering
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "build")));

// Monter API-ruter
app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth/token", authTokenRouter);
app.use("/api/user", userRouter);
app.use("/api/users", userRouter);
app.use("/api/terms", termsRouter);
app.use("/api/term", termRouter);
app.use("/api/faq", faqRouter);
app.use("/api/faqs", faqsRouter);
app.use("/api/project", projectRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/upload", fileRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/exercise", exerciseRouter);
app.use("/api/event", eventRouter);
app.use("/api/events", eventsRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/team", teamRouter);

////// ANNE PRIVATE

app.use("/api/invitation", invitationRouter);
app.use("/api/admin/invitations", invitationsRouter);
app.use("/api/admin/invitation", invitationRouter);
app.use("/api/admin/guest", guestRouter);
app.use("/api/admin/guests", guestsRouter);
app.use("/api/admin/overview", overviewRouter);

// Håndter SPA-routing
app.get("*", (req, res) => {
  if (req.accepts("html")) {
    res.status(200).sendFile(path.resolve(clientDistPath, "index.html"));
  } else {
    res.status(404).json({ message: "Ruten blev ikke fundet" });
  }
});

// Middleware for 404 fejl (rute ikke fundet)
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruten blev ikke fundet." });
});

// Global fejlhåndtering
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "En intern serverfejl opstod." });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Start server
const PORT = process.env.SERVER_PORT || 8080;

const startServer = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`Serveren kører på port ${PORT}`);
  });
};

export default startServer;
