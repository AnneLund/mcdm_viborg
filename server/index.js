import * as dotenv from "dotenv";
dotenv.config({ path: `.env`, override: true });

import startServer from "./lib/server.js";

const application = {};

// Vi initialiserer vores applikation.
application.init = () => {
  // Vi kalder run metoden på vores server module.
  startServer();
};

application.init();
