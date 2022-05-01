const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {useNewUrlParser: true, useUnifiedTopology: true});

const express = require("express"),

morgan = require("morgan");

const app = express();

app.use(morgan("common"));

app.use(express.static("public"));

const bodyParser = require("body-parser"),
  methodOverride = require("method-override");
const { restart } = require("nodemon");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');


---------------------------------------API URL's and Functions-------------------------------------------------------

//returns home page

app.get("/", passport.authenticate("jwt", { session: false }), (req,res) => {
  res.send("Welcome to the My Flix App!!!")
});

//allows new user to register an account

app.post("/users/register", (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + "already exists");
    } else {
      Users
      .create({
       Username: req.body.Username,
       Password: req.body.Password,
       Email: req.body.Email,
       Birthdate: req.body.Birthdate
      })
      .then((user) => {res.status(201).json(user)})
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      })
     }
   })
   .catch((error) => {
     console.error(error);
     res.status(500).send("Error: " + error );
   });
});

//allows user to add movie to favorite list

app.post("/movies/:Username/favorites", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
    {
       $push: { Favorites: req.params.MovieID }
    },
    { new: true },
    ( err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// returns web developer API instructions

app.get("/documentation", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.sendFile("Public/documentation.html", { root: __dirname });
});

//returns list of all movies

app.get("/movies", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find()
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// //returns list of all users

app.get("/users", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.find()
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//locates a single user by username

app.get("/users/:Username", passport.authenticate("jwt", { session: false }), (req,res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//allows single movie to be searched by title

app.get("/movies/:titles", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.titles })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// returns list of movies by genre

app.get("/movies/genres/:genres", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find({ "Genre.Name" : req.params.genres })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Return data about a director (bio, birth year, death year) by name

app.get("/movies/directors/:names", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ "Director.Name": req.params.names })
  .then((movie) => {
   if (movie) {
     res.status(200).json(movie.Director.Bio);
   } else {
     res.status(400).send("Director not found.");
   };
  })
  .catch((err) => {
    res.status(500).send("Error" + err);
  });
});

//allows user to update their account

app.put("/users/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthdate: req.body.Birthdate
      }
    },
     { new: true },
     (err, updatedUser) => {
       if(err) {
         console.error(err);
         res.status(500).send( "Error: " + err);
       } else {
         res.json(updatedUser)
       }
    });
});

//allows user to remove movie from favorite list

app.delete("/movies/:Username/favorites", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username },
    {
      $pull: {Favorites: req.params.MovieID }
    },
    { new: true},
    (err,updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(200).send(req.params.MovieID + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      restart.status(500).send("Error: " + err);
    });
});

//allows user to delete their account

app.delete("/users/unregister/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send( req.params.Username + " was not found");
  } else {
    res.status(200).send( req.params.Username + " was deleted");
  }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

---------------------------------------Catching Errors!-------------------------------------------------------


// //function to log all errors

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("UH-OH! Something broke!");
});

app.listen(5500, () => {
  console.log("Your app is listening on port 5500.");
});
