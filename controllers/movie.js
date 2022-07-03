const { StatusCodes } = require("http-status-codes");
const moviesService = require("../services/movie");

const getMoviesList = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit), 10) || 10;
    const userId = req.user.userId;

    const movies = await moviesService.getMoviesFromDB(userId, page, limit);

    return res.status(StatusCodes.OK).json({ movies });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMoviesList };
