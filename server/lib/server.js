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
import userRouter from "./routes/users/user.route.js";
import usersRouter from "./routes/users/users.route.js";
import { Server } from "socket.io";
import { createServer } from "http";
import termsRouter from "./routes/terms/terms.route.js";
import termRouter from "./routes/terms/term.route.js";

// Opsætning af Express
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
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
      "http://localhost:5173",
      "https://mcd-viborg-om232.ondigitalocean.app",
      "https://mcd-viborg-om232.ondigitalocean.app/api",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api/users", usersRouter);
app.use("/api/user", userRouter);
app.use("/api/terms", termsRouter);
app.use("/api/term", termRouter);

// Håndter SPA-routing
// app.get("*", (req, res) => {
//   if (req.accepts("html")) {
//     res.status(404).sendFile(path.resolve(clientDistPath, "index.html"));
//   } else {
//     res.status(404).json({ message: "Ruten blev ikke fundet" });
//   }
// });

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

app.get("*", (req, res) => {
  res.sendFile(path.resolve(clientDistPath, "index.html"));
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
