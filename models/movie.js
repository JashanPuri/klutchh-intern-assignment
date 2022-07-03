const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
  {
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
    totalRatings: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
