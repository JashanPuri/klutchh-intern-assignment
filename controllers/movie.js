const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors/index");
const moviesService = require("../services/movie");

const getMoviesList = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit), 20) || 20;
    const userId = req.user.userId;

    const movies = await moviesService.getMoviesFromDB(userId, page, limit);

    return res.status(StatusCodes.OK).json({ movies });
  } catch (error) {
    next(error);
  }
};

const rateMovie = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const userId = req.user.userId;
    const rating = Number(req.body.rating);

    if (!rating || rating < 0 || rating > 5) {
      throw new BadRequestError(
        "Rating should be a number between 1 and 5 (inclusive)"
      );
    }

    await moviesService.rateMovie(movieId, userId, rating);

    res.status(StatusCodes.OK).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getMoviesList, rateMovie };
