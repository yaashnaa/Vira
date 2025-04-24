import { generateUsername } from "unique-username-generator";

export const createAnonymousUsername = () => {
  return generateUsername("-", 2, 6); // separator, number of words, optional digits
};
