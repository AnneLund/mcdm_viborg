import userModel from "../../models/user.model.mjs";
import dbConnect from "../../dbConnect.js";
import termModel from "../../models/term.model.mjs";

/*

    Create new User

*/
export const seedUser = async (user) => {
  console.log("-- User --");
  console.log(user);
  console.log("--\n");

  await dbConnect();

  try {
    let newUser = await userModel.create(user);

    return newUser;
  } catch (error) {
    console.log(error);
  }
};

/*

    Create new Term

*/
export const seedTerm = async (term) => {
  console.log("-- Term --");
  console.log(term);
  console.log("--\n");

  await dbConnect();

  try {
    let newTerm = await termModel.create(term);

    return newTerm;
  } catch (error) {
    console.log(error);
  }
};
