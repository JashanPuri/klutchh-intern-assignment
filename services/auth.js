const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { NotFoundError, UnauthenticatedError } = require("../errors/index");

// create user in db
const signUpUser = async (name, username, password) => {
  // hashing the password with bcrypt
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // creating user in mongo db
  return await User.create({ name, username, password: hashedPassword });
};

// sign in user - verify password and return access token
const signInUser = async (username, password) => {
  // check if user exsits
  const user = await User.findOne({ username });

  // user not found
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // verify password
  const doesPasswordMatch = await bcrypt.compare(password, user.password);

  // password not verified
  if (!doesPasswordMatch) {
    throw new UnauthenticatedError("Incorrect password");
  }

  // creating and returning jwt access token
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

module.exports = { signUpUser, signInUser };
