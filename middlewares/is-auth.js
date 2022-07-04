const jwt = require("jsonwebtoken");

const { UnauthenticatedError } = require("../errors/index");

// authentication check
exports.isAuth = (req, res, next) => {
  try {
    // extracting Authorization header
    const authHeader = req.get("Authorization");

    // header not present
    if (!authHeader) {
      throw new UnauthenticatedError("Not authenticated");
    }

    // header not in format "Bearer <token>"
    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthenticatedError("Invalid token format");
    }

    const token = authHeader.split(" ")[1];

    // verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // payload
    const { userId, username } = decoded;

    // setting user in request object
    req.user = { userId, username };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new UnauthenticatedError(`Not authenticated, ${error.message}`));
    }

    console.log(error);
    next(error);
  }
};
