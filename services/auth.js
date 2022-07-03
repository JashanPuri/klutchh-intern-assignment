const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { NotFoundError, UnauthenticatedError } = require("../errors/index");

const signUpUser = async (name, username, password) => {
  // hashing the password with bcrypt
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  return await User.create({ name, username, password: hashedPassword });
};

const signInUser = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const doesPasswordMatch = await bcrypt.compare(password, user.password);

  if (!doesPasswordMatch) {
    throw new UnauthenticatedError("Incorrect password");
  }

  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

module.exports = { signUpUser, signInUser };
