const jwt = require("jsonwebtoken");

const { UnauthenticatedError } = require("../errors/index");

exports.isAuth = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      throw new UnauthenticatedError("Not authenticated");
    }

    if (!authorization.startsWith("Bearer ")) {
      throw new UnauthenticatedError("Invalid token format");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { userId, username } = decoded;

    req.user = { userId, username };

    next();
  } catch (error) {
    console.log(error);
    next(new UnauthenticatedError("Not authenticated"));
  }
};
