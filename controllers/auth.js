const authService = require("../services/auth");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, CustomAPIError } = require("../errors/index");

// User sign up controller
const signUp = async (req, res, next) => {
  try {
    // extracting user fields from request body
    const name = req.body.name?.trim();
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    // calling service to create user
    const user = await authService.signUpUser(name, username, password);

    if (user) {
      // user created
      return res
        .status(StatusCodes.CREATED)
        .json({ message: "user registered" });
    } else {
      // error occured
      const error = CustomAPIError("Something went wrong");
      error.statusCode = 500;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// User sign in controller
const signIn = async (req, res, next) => {
  try {
    // extracting username password
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    // username should be present
    if (!username) {
      throw new BadRequestError("Please provide a username");
    }

    // password should be present
    if (!password) {
      throw new BadRequestError("Please provide a password");
    }

    // signing in user and getting access token
    const token = await authService.signInUser(username, password);

    return res.status(StatusCodes.OK).json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp, signIn };
