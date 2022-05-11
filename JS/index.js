---------------------------------------Middleware/Packages-------------------------------------------------------

const mongoose = require("mongoose");
const Models = require("./models.js");
const express = require("express");
const app = express();

const Movies = Models.Movie;
const Users = Models.User;

morgan = require("morgan");
app.use(morgan("common"));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/myFlixDB", {useNewUrlParser: true, useUnifiedTopology: true});

const bodyParser = require("body-parser"),
methodOverride = require("method-override");
const { restart } = require("nodemon");
app.use(bodyParser.urlencoded({ extended: true,}));
app.use(bodyParser.json());
app.use(methodOverride());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

---------------------------------------API URL's and Functions-------------------------------------------------------

//function returns a homepage

app.get("/", passport.authenticate("jwt", { session: false }), (req,res) => {
  res.send("Welcome to the My Flix App!!!")
});


// function returns myFlixDB instructions for developer use

app.get("/documentation", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.sendFile("Public/documentation.html", { root: __dirname });
});


//function allows a new user to register

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
         Birthdate: req.body.Birthdate,
         Favorites: req.body.Favorites
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


//function allows user to add movies to favorites list

app.post("/users/:Username/movies/:MovieID", passport.authenticate("jwt", { session: false }), (req, res) => {
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


//function returns list of all movies

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


//function returns list of all registered users

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


//function locates a single user by username

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


//function allow user to locate movie by Title

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


// function filters list of movies by genre and displays the movie data

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


//functions returns data about a director (bio, birth year, death year) by name

app.get("/movies/directors/:names", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ "Director.Name": req.params.names })
  .then((movie) => {
   if (movie) {
     res.status(200).json(movie.Director);
   } else {
     res.status(400).send("Director not found.");
   };
  })
  .catch((err) => {
    res.status(500).send("Error" + err);
  });
});


//function allows user to update their account

app.put("/users/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthdate: req.body.Birthdate,
        Favorites: req.body.Favorites
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


//function allows user to remove a movie from favorite list

app.delete("/users/:Username/movies/:MovieID", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
    {
       $pull: { Favorites: req.params.MovieID }
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

---------------------------------------Catching Errors-------------------------------------------------------


//function to log all errors

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("UH-OH! Something broke!");
});


---------------------------------------Port Connection-------------------------------------------------------
app.listen(5500, () => {
  console.log("Your app is listening on port 5500.");
});
