require("dotenv").config();
const express = require("express");
const swaggerUI = require("swagger-ui-express");

const connectDB = require("./db/connect"); // connect to db
const swaggerDocument = require("./swagger.json"); // api docs

// routers
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movie");

// middlewares
// error handlers
const notFoundMiddleware = require("./middlewares/not-found"); // route not found
const errorHandlerMiddleware = require("./middlewares/error-handler"); // error handling

const app = express(); // express app initialisation

app.use(express.json()); // json parsing

app.use((req, res, next) => {
  // SETTING UP CORS HEADERS (CROSS ORIGIN RESOURCE SHARING)

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

// routes
app.get("/", (req, res) => {
  res.send("movies api");
});

// api documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// authentication routes
app.use("/api/v1/auth", authRoutes);
// movie routes
app.use("/api/v1/movie", movieRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

// start the server
const start = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    // connect to mongo db
    await connectDB(mongoURI);

    // listen to requests
    app.listen(port, console.log(`Listening at port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
