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
  const skip = (page - 1) * limit;

  let movies = await Movie.find().skip(skip).limit(limit);

  //   console.log(
  //     await Movie.aggregate([
  //       {
  //         $lookup: {
  //           from: "ratings",
  //           localField: "_id",
  //           foreignField: "movieId",
  //           as: "movie_ratings",
  //         },
  //       },
  //     ]).limit(1)
  //   );

  // calculating average of each movie
  // extracting the required properties
  return await Promise.all(
    movies.map(async (movie) => {
      let averageRatings;
      if (movie.numberOfReviews === 0) {
        averageRatings = null;
      } else {
        averageRatings = (movie.totalRatings / movie.numberOfReviews).toFixed(
          2
        );
      }

      // const yourRating = await getUserRatingForMovie(userId, movie._id);

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

const rateMovie = async (movieId, userId, rating) => {
  const movie = await Movie.findOne({ _id: movieId });

  if (!movie) {
    throw new NotFoundError("Movie not found");
  }

  let ratingObj;

  ratingObj = await getUserRatingForMovie(userId, movieId);

  if (!ratingObj) {
    ratingObj = new Rating({ movieId, userId, rating });
  } else {
    movie.totalRatings -= ratingObj.rating;
    movie.numberOfReviews -= 1;
    ratingObj.rating = rating;
  }
  if (!additionDoesOverflow(movie.totalRatings, rating)) {
    movie.totalRatings += rating;
    movie.numberOfReviews += 1;
  }

  await ratingObj.save();

  await movie.save();
};

module.exports = { getMoviesFromDB, rateMovie };
