import express from 'express';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);

const previewRouter = express.Router();

// About page route.
previewRouter.get("/preview/*", (req, res) => {
    let index = path.join(__dirname, "../../../../", "preview", 'index.html')
    res.sendFile(index);
  

});

previewRouter.get("/preview", (req, res) => {
    let index = path.join(__dirname, "../../../../", "preview", 'index.html')
    res.sendFile(index);
});

export default previewRouter;