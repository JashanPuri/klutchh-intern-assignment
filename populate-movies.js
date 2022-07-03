require("dotenv").config();
const axios = require("axios").default;

const connectDB = require("./db/connect");
const Movie = require("./models/movie");

const getMoviesFromTMDB = async (apiKey, page) => {
  console.log("Fetching popular movies from TMDB");
  const url = `https://api.themoviedb.org/3/movie/  ?api_key=${apiKey}&&page=${page}`;

  const response = await axios.get(url);
  console.log("Status code:", response.status);

  if (response.status == 200) {
    return response.data.results;
  }

  return [];
};

const populate = async () => {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    const MONGO_URI = process.env.MONGO_URI;
    const totalPages = 2;

    let movies = [];

    for (let page = 1; page <= totalPages; page++) {
      const tmdbMovies = await getMoviesFromTMDB(TMDB_API_KEY, page);
      movies = [...movies, ...tmdbMovies];
    }

    console.log(movies.length);

    await connectDB(MONGO_URI);

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
