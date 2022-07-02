require("dotenv").config();
const express = require("express");

const connectDB = require("./db/connect");


const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    await connectDB(mongoURI);

    app.listen(port, console.log(`Listening at port ${port}`));
  } catch (error) {}
};

start()