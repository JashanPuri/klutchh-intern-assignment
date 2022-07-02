const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a name"],
  },
  overview: {
    type: String,
  },
  poster_path: {
    type: String,
  },
});

module.exports = mongoose.model("Movie", movieSchema)
