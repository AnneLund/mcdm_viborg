import dbConnect from "../db/dbConnect.js";
import userModel from "../db/models/user.model.mjs";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signInUser = async (credentials) => {
  let result = { status: "error", message: "En fejl opstod", data: [] };

  try {
    await dbConnect();

    // Find brugeren i databasen baseret på e-mail
    let user = await userModel.findOne({ email: credentials.email });

    if (!user) {
      return {
        status: "error",
        message: "Brugeren findes ikke. Tjek din e-mail og prøv igen.",
        data: [],
      };
    }

    // Sammenlign indtastet adgangskode med den hash'ede adgangskode i databasen
    let validPass = await bcryptjs.compare(
      credentials.password,
      user.hashedPassword
    );
    if (!validPass) {
      return {
        status: "error",
        message: "Forkert adgangskode. Prøv igen.",
        data: [],
      };
    }

    // Generer JWT-token
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } // Standard til 1 time, hvis ikke sat
    );

    result = {
      status: "ok",
      message: `${user.role} bruger logget ind med succes`,
      data: { token },
    };
  } catch (error) {
    console.error("Login fejl:", error);
    result = { status: "error", message: "Serverfejl under login", data: {} };
  }

  return result;
};

// Autentificering med token
export const signInWithToken = async (token) => {
  await dbConnect();

  let result = {
    status: "error",
    message: "Noget gik galt, måske er tokenet udløbet",
    data: {},
  };

  try {
    if (!token) {
      return {
        status: "error",
        message: "Ingen token modtaget",
        data: {},
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return {
        status: "error",
        message: "Token er ugyldig eller udløbet",
        data: {},
      };
    }

    let user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return {
        status: "error",
        message: "Bruger ikke fundet",
        data: {},
      };
    }

    result = {
      status: "ok",
      message: "Token-godkendelse succesfuld",
      data: user,
    };
  } catch (error) {
    console.error("Token verificeringsfejl:", error);
    result = {
      status: "error",
      message: "Tokenet er ugyldigt eller udløbet. Log ind igen.",
      data: {},
    };
  }

  return result;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  await dbConnect();

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return {
        status: "error",
        message: "Bruger ikke fundet",
        code: 404,
        data: {},
      };
    }

    // Tjek om den nuværende adgangskode stemmer
    const validPassword = await bcryptjs.compare(
      currentPassword,
      user.hashedPassword
    );
    if (!validPassword) {
      return {
        status: "error",
        message: "Nuværende password er forkert",
        code: 400,
        data: {},
      };
    }

    // Hash den nye adgangskode
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Opdater adgangskoden i databasen
    user.hashedPassword = hashedPassword;
    await user.save();

    return {
      status: "ok",
      message: "Password opdateret!",
      code: 200,
      data: {},
    };
  } catch (error) {
    console.error("Error in changePassword:", error);
    return {
      status: "error",
      message: "Internal server error",
      code: 500,
      data: {},
    };
  }
};
