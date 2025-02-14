import dbConnect from '../db/dbConnect.js';
import userModel from '../db/models/user.model.mjs';
import { deleteUserImage } from './file.handler.js';

export const getUsers = async () => {

    
    let result = {status: 'error', message: "An Error Occurred - See Database log.", data: []};
    
    await dbConnect();

    try {

        let data = await userModel.find({}).select('-__v');
        result = {status: 'ok', message: "Users fetched successfully", data: data}

    } catch (error) {   

        console.log(error)
       
    }

    return result
}

export const createUser = async (body) => {
  
    let result = {status: 'error', message: "An Error Occurred - See Database log.", data: []};

    await dbConnect();

    try {

        body.picture = body.picture === undefined  ? `${process.env.SERVER_HOST}/users/no-user.jpg` : body.picture;
   
        let data = await userModel.create(body);
        result = {status: 'ok', message: "User created successfully", data: data}

    } catch (error) {   

        console.log(error)
    }

    return result

}

export const updateUser = async (user) => {

    let result = {status: 'error', message: "An Error Occurred - See Database log.", data: []};

    await dbConnect();
    await deleteUserImage(user.id);


    try {
        let data = await userModel.findByIdAndUpdate(user.id, user, {new: true});
        result = {status: 'ok', message: "User updated successfully", data: data}

    } catch (error) {   

        console.log(error)
    }

    return result
}

export const deleteUser = async (id) => {

    let result = {status: 'error', message: "An Error Occurred - See Database log.", data: []};
    await deleteUserImage(id);
    await dbConnect();

    try {
        let data = await userModel.findByIdAndDelete(id);
        result = {status: 'ok', message: "User deleted successfully", data: data}

    } catch (error) {   

        console.log(error)
    }
    
    return result
}

export const getUserById = async (id) => {

    let result = {status: 'error', message: "An Error Occurred - See Database log.", data: []};

    await dbConnect();

    try {
        let data = await userModel.findById(id);
        result = {status: 'ok', message: "User fetched successfully", data: data}

    } catch (error) {   

        console.log(error)
    }

    return result
}