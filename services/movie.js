const Movie = require("../models/movie");
const Rating = require("../models/ratings");
const { NotFoundError } = require("../errors/index");

const getUserRatingForMovie = async (userId, movieId) => {
  return await Rating.findOne({ userId, movieId });
};

function additionDoesOverflow(a, b) {
  var c = a + b;
  return a !== c - b || b !== c - a;
}

const getMoviesFromDB = async (userId, page, limit) => {
  // pagination
  const skip = (page - 1) * limit;

  // fetch movies from db
  let movies = await Movie.find().skip(skip).limit(limit);

  return await Promise.all(
    movies.map(async (movie) => {
      let averageRatings;

      // calculating average of each movie
      if (movie.numberOfReviews === 0) {
        averageRatings = null;
      } else {
        averageRatings = (movie.totalRatings / movie.numberOfReviews).toFixed(
          2
        );
      }

      // extracting the required properties
      const { _id, title, overview, posterUrl } = movie;
      return {
        _id,
        title,
        overview,
        posterUrl,
        averageRatings,
      };
    })
  );
};

// rate a movie
const rateMovie = async (movieId, userId, rating) => {
  // find movie with given movie id
  const movie = await Movie.findOne({ _id: movieId });

  // movie not found
  if (!movie) {
    throw new NotFoundError("Movie not found");
  }

  let ratingObj;

  // get previous rating from user
  ratingObj = await getUserRatingForMovie(userId, movieId);

  if (!ratingObj) {
    // user rating first time
    ratingObj = new Rating({ movieId, userId, rating });
  } else {
    // user changing the previous rating
    movie.totalRatings -= ratingObj.rating;
    movie.numberOfReviews -= 1;
    ratingObj.rating = rating;
  }

  // check overflow
  if (!additionDoesOverflow(movie.totalRatings, rating)) {
    // updating total ratings and number of reviews of the movie
    movie.totalRatings += rating;
    movie.numberOfReviews += 1;
  }

  // saving to rating collection
  await ratingObj.save();

  // saving the movie in db
  await movie.save();
};

module.exports = { getMoviesFromDB, rateMovie };
