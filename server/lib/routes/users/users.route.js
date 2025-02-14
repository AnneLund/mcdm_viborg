import express from 'express';
import { getUsers } from '../../handlers/user.handler.js';

const usersRouter = express.Router();


// Get
usersRouter.get("/users/", async (req, res) => {

    const data = await getUsers();
  
   
    if(data.status === 'ok') {

        return res.status(200).send({ message: data.message, data: data.data });

    } else {

        return res.status(200).send({ message: data.message, data: [] });

    }

});


export default usersRouter;
