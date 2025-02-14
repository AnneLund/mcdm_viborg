import express from 'express';
import { signInUser } from '../../handlers/auth.handler.js';
const authRouter = express.Router();

// Get
authRouter.post("/auth/signin", async (req, res) => {
  
    const result = await signInUser(req.body);

    return res.status(200).send(
        { 
            ...result
        }
    );

});


export default authRouter;