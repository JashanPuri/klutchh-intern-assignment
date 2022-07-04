const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors/index");
const moviesService = require("../services/movie");

// fetch movie lists
const getMoviesList = async (req, res, next) => {
  try {
    // extracting query params
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit), 20) || 20;

    // user id
    const userId = req.user.userId;

    // fetch movies
    const movies = await moviesService.getMoviesFromDB(userId, page, limit);

    return res.status(StatusCodes.OK).json({ movies });
  } catch (error) {
    next(error);
  }
};

// rate movie
const rateMovie = async (req, res, next) => {
  try {
    // movie id
    const movieId = req.params.movieId;
    // user id
    const userId = req.user.userId;
    // rating
    const rating = Number(req.body.rating);

    // checking for rating constraints
    if (!rating || rating < 0 || rating > 5) {
      throw new BadRequestError(
        "Rating should be a number between 1 and 5 (inclusive)"
      );
    }

    // rating the movie
    await moviesService.rateMovie(movieId, userId, rating);

    res.status(StatusCodes.OK).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getMoviesList, rateMovie };
