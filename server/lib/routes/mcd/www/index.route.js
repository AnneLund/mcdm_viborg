import express from 'express';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import { assignmentSettings } from '../../../db/mcd/misc/settings.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);

const indexRouter = express.Router();
// Index

indexRouter.get("", (req, res) => {

    res.redirect('/www');
});



indexRouter.get("/mcd/", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(assignmentSettings));
});

export default indexRouter;