require("dotenv").config();
const axios = require("axios").default;

const connectDB = require("./db/connect");
const Movie = require("./models/movie");

const getMoviesFromTMDB = async (apiKey, page) => {
  console.log("Fetching popular movies from TMDB");
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&&page=${page}`;

  // get movies from tmdb api
  const response = await axios.get(url);
  console.log("Status code:", response.status);

  if (response.status == 200) {
    return response.data.results.map((movie) => {
      return {
        ...movie,
        posterUrl: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
      };
    });
  }

  return [];
};

// fetch movies from tmdb api and store in mongo db
const populate = async () => {
  try {
    // tmdb api key
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    // mongodb connection string
    const MONGO_URI = process.env.MONGO_URI;

    const totalPages = 2;

    let movies = [];

    for (let page = 1; page <= totalPages; page++) {
      // fetch from tmdb api
      const tmdbMovies = await getMoviesFromTMDB(TMDB_API_KEY, page);
      movies = [...movies, ...tmdbMovies];
    }

    await connectDB(MONGO_URI);

    // store in mongo db
    await Movie.deleteMany();
    await Movie.create(movies);
    console.log("Movies fetched and added to db");

    process.exit(0);
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};

populate();
