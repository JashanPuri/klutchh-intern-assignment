const authService = require("../services/auth");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, CustomAPIError } = require("../errors/index");

const signUp = async (req, res, next) => {
  try {
    const name = req.body.name?.trim();
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    const user = await authService.signUpUser(name, username, password);

    if (user) {
      return res
        .status(StatusCodes.CREATED)
        .json({ message: "user registered" });
    } else {
      const error = CustomAPIError("Something went wrong");
      error.statusCode = 500;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    if (!username) {
      throw new BadRequestError("Please provide a username");
    }

    if (!password) {
      throw new BadRequestError("Please provide a password");
    }

    const token = await authService.signInUser(username, password);

    return res.status(StatusCodes.OK).json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp, signIn };
