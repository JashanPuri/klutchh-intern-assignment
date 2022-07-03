require("dotenv").config();
const express = require("express");

const connectDB = require("./db/connect");

// routers
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movie");

// middlewares
// error handlers
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

const app = express();

app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("movies api");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", movieRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    await connectDB(mongoURI);

    app.listen(port, console.log(`Listening at port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
