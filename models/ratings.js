const mongoose = require("mongoose");

// rating model schema
const ratingsSchema = mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const Rating = mongoose.model("Rating", ratingsSchema);

Rating.createIndexes({ movieId: 1, userId: 1 });

module.exports = Rating;
