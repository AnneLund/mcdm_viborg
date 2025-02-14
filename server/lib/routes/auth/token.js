import express from 'express';
import { signInWithToken } from '../../handlers/auth.handler.js';
import multer from 'multer';
const authTokenRouter = express.Router();

// Multer Setup for storage.
const employeeStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/employees')
    },
    filename: function (req, file, cb) {
        console.log('FILE', file, req.body)
        
        let newFileName = getNewUID() + '.' + mime.extension(file.mimetype)
        let ext = mime.extension(file.mimetype)
        cb(null, newFileName);
    }
});

const upload = multer({ storage: employeeStorage });
// Get
authTokenRouter.post("/auth/token", upload.single('file'), async (req, res) => {
  
    const result = await signInWithToken(req.body.token);
   

    return res.status(200).send(
        { ...result }
    );


    
});

export default authTokenRouter;