const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
require("dotenv").config();

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);
app.use(express.json());

const movieHandlers = require("./movieHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/movies", movieHandlers.postMovie);
app.post("/api/users", movieHandlers.postUsers);

const { getUsers, getUserById } = require("./userHandlers");

app.get("/api/users", getUsers);
app.get("/api/users/:id", getUserById);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .getConnection()
  .then(() => {
    console.log("Connected to database");
    app.listen(port, (err) => {
      if (err) {
        console.error("Something bad happened");
      } else {
        console.log(`Server is listening on ${port}`);
      }
    });
  })
  .catch((err) => {
    console.error(err);
  });
