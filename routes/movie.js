const { Router } = require("express");

const moviesController = require("../controllers/movie");
const { isAuth } = require("../middlewares/is-auth");

const router = Router();

// get movie lists
router.get("/", isAuth, moviesController.getMoviesList);

// rate a movie
router.post("/:movieId/rate", isAuth, moviesController.rateMovie);

module.exports = router;
