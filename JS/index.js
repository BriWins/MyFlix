const express = require("express"),

morgan = require("morgan");

const app = express();

app.use(morgan("common"));

app.use(express.static("public"));

const bodyParser = require("body-parser"),
  methodOverride = require("method-override");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());


//returns list of all movies

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// //allows single movie to be searched by title

app.get("/movies/:title", (req, res) => {
  res.json(
    movies.find((movies) => {
      return movies.name === req.params.name;
    })
  );
});

// //allows user to add movie to favorite list

app.post("/movies/:users/favorites", (req, res) => {
  res.status(201);
  res.send("The movie has been added to favorites list.");
});

// //allows user to remove movie from favorite list

app.delete("/movies/:users/favorites", (req, res) => {
  res.send("The movie has been removed from favorites list.");
});

// //allows new user to register an account

app.post("/users/register", (req, res) => {
  let newUser = req.body;
  if (!newUser.name) {
    const message = "Missing name for account.";
    res.status(400).send(message);
  } else {
    // newUsers.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// //allows user to delete their account

app.delete("/users/:users", (req, res) => {
  res.send("Your account has been removed");
});

// //allows user to update their account

app.put("/users/:users", (req, res) => {
  res.send("Your account has been updated.");
});

// // //Return data about a director (bio, birth year, death year) by name

app.get("/movies/directors/:names", (req, res) => {
  res.send("Details about the director: " + req.params.names);
});

//returns movie by filtering data by genre

app.get("/movies/:genres", (req, res) => {
  res.json(
    movies.find((genres) => {
      return movies.genres === req.params.genres;
    })
  );
});

// returns web developer API instructions
app.get("/documentation", (req, res) => {
  res.sendFile("Public/documentation.html", { root: __dirname });
});

// //function to log all errors

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("UH-OH! Something broke!");
});

app.listen(5500, () => {
  console.log("Your app is listening on port 5500.");
});
