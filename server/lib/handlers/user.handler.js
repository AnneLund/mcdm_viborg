import dbConnect from "../db/dbConnect.js";
import userModel from "../db/models/user.model.mjs";
import mongoose from "mongoose";

const toObjectId = (id) =>
  mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(String(id)) : null;

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return toObjectId(id);
};

export const getUsers = async () => {
  let result = {
    status: "error",
    message: "An Error Occurred - See Database log.",
    data: [],
  };

  await dbConnect();

  try {
    let data = await userModel.find({}).select("-__v");
    result = {
      status: "ok",
      message: "Users fetched successfully",
      data: data,
    };
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const createUser = async (body) => {
  let result = {
    status: "error",
    message: "An Error Occurred - See Database log.",
    data: [],
  };

  await dbConnect();

  try {
    body.picture =
      body.picture === undefined
        ? `${process.env.SERVER_HOST}/users/no-user.jpg`
        : body.picture;

    let data = await userModel.create(body);
    result = { status: "ok", message: "User created successfully", data: data };
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const updateUser = async (user) => {
  let result = {
    status: "error",
    message: "An Error Occurred - See Database log.",
    data: [],
  };

  if (!user.id) {
    console.error("Fejl: ID mangler i updateUser");
    return { status: "error", message: "User ID is required", data: [] };
  }

  const userId = validateObjectId(user.id);

  await dbConnect();

  try {
    const { id, ...updateData } = user;

    let data = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!data) {
      return { status: "not_found", message: "User not found", data: [] };
    }

    result = { status: "ok", message: "User updated successfully", data: data };
  } catch (error) {
    console.error("Fejl i updateUser:", error);
    result = { status: "error", message: error.message, data: [] };
  }

  return result;
};

export const deleteUser = async (id) => {
  let result = {
    status: "error",
    message: "An Error Occurred - See Database log.",
    data: [],
  };

  await dbConnect();

  try {
    let data = await userModel.findByIdAndDelete(id);
    result = { status: "ok", message: "User deleted successfully", data: data };
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const getUserById = async (id) => {
  let result = {
    status: "error",
    message: "An Error Occurred - See Database log.",
    data: [],
  };

  await dbConnect();

  try {
    let data = await userModel.findById(id);
    result = { status: "ok", message: "User fetched successfully", data: data };
  } catch (error) {
    console.log(error);
  }

  return result;
};
