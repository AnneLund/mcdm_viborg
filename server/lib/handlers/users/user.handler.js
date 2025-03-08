import dbConnect from "../../db/dbConnect.js";
import userModel from "../../db/models/user.model.mjs";

export const getUsers = async () => {
  try {
    await dbConnect();

    const users = await userModel.find({});

    return {
      status: "ok",
      message: "Teams fetched successfully",
      data: users,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      status: "error",
      message: "An error occurred while fetching users",
      data: [],
      error: error.message,
    };
  }
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

export const updateUser = async (id, body) => {
  try {
    await dbConnect();

    const user = await userModel.findById(id);

    if (!user) {
      return {
        status: "not_found",
        message: "User not found",
        data: [],
      };
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return {
      status: "ok",
      message: "User updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      status: "error",
      message: "An error occurred while updating the user",
      data: [],
      error: error.message,
    };
  }
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
    let data = await userModel
      .findById(id)
      .populate("team")
      .populate({
        path: "feedback.project",
        model: "project",
      })
      .populate({
        path: "feedback.exercise",
        model: "exercise",
      });
    result = { status: "ok", message: "User fetched successfully", data: data };
  } catch (error) {
    console.log(error);
  }

  return result;
};
