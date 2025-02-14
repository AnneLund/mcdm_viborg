import { stubTerms, stubUsers } from "./seed.data.js";
import { seedTerm, seedUser } from "./seed.helper.js";

export const seedUsers = async () => {
  for (let i = 0; i < stubUsers.length; i++) {
    await seedUser(stubUsers[i]);
  }
};

export const seedTerms = async () => {
  for (let i = 0; i < stubTerms.length; i++) {
    await seedTerm(stubTerms[i]);
  }
};
