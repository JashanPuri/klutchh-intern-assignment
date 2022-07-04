const mongoose = require("mongoose");

// connect to mongo db
const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
