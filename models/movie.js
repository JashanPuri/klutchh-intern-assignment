const mongoose = require("mongoose");

// movie model schema
const movieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a name"],
    },
    overview: {
      type: String,
    },
    posterUrl: {
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
