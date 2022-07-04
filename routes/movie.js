const { Router } = require("express");

const moviesController = require("../controllers/movie");
const { isAuth } = require("../middlewares/is-auth");

const router = Router();

router.get("/", isAuth, moviesController.getMoviesList);

router.post("/:movieId/rate", isAuth, moviesController.rateMovie);

module.exports = router;
