const authService = require("../services/auth");
const { StatusCodes } = require("http-status-codes");

const signUp = async (req, res, next) => {
  try {
    const name = req.body.name?.trim();
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    const user = await authService.signUpUser(name, username, password);

    const token = authService.createJWT(user);

    res
      .status(StatusCodes.CREATED)
      .json({ user: { name: user.name, username: user.username }, token });
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp };
