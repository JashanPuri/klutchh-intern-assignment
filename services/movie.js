const Movie = require("../models/movie");
const Rating = require("../models/ratings");

const getUserRatingForMovie = async (userId, movieId) => {
  return await Rating.findOne({ userId, movieId });
};

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
  // finding rating given by authenticated user
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

      const yourRating = await getUserRatingForMovie(userId, movie._id);

      const { _id, title, overview, poster_path } = movie;
      return {
        _id,
        title,
        overview,
        poster_path,
        averageRatings,
        yourRating,
      };
    })
  );
};

module.exports = { getMoviesFromDB };
