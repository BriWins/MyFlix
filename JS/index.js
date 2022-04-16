const express = require("express"),

morgan = require("morgan");

const app = express();

app.use(morgan("common"));

app.use(express.static("public"));

const topMovies = [
   {
        movieTitle: "Black Panther",
        director: "Ryan Coogler",
        movieRelease: "February 16, 2018", //Release date for theaters
        genre: "Adventure",
        directorDOB: "May 23, 1986", //DOB- director's date of birth
        directorPOB: "Oakland, CA",   //POB-director's place of birth
        directorDOD: "N/A", //DOD-director's date of death
        movieInfo:"American superhero film based on the Marvel Comics character, Blank Panther, depicted as the King and protector of the fictional African nation of Wakanda."
    },
    {
        movieTitle: "Mad Max: Fury Road(2015)",
        director:"George Miller",
        movieRelease: "March 3, 1945",
        genre: "Adventure",
        directorDOB: "May 23, 1986",
        directorPOB: "Chinchilla,Queensland, Australia",   
        directorDOD: "N/A", 
        movieInfo:"In a post-apocalyptic desert wasteland, Fury Road follows Max Rockatansky to flee from cult leader Immortan Joe and his army."
    },
    {
        movieTitle: "Braidsmaids(2011)",
        director:"Paul Feig",
        movieRelease:"May 13, 2011",
        genre: "Comedy, Romance",
        directorDOB: "September 17, 1962",
        directorPOB: "Mount Clemens, Michigan",   
        directorDOD: "N/A", 
        movieInfo:"Annie is a single woman whose own life is in a mess. Her best friend, Lillian, is engaged and Annie has to serve as maid of honor. Penniless yet determined to make things perfect, she leads Lillian and other braidsmaids down the wild road to the wedding."
    },
    {
        movieTitle: "Lady Bird",
        director:"Greta Celeste Gerwig",
        movieRelease:"November 22, 2017",
        genre: "Comedy",
        directorDOB: "August 4, 1983",
        directorPOB: "Sacramento, California",   
        directorDOD: "N/a", 
        movieInfo:"A teenager navigates a loving but turbulent relationship with her mother during her eventful senior year of high school."
    },
    {
        movieTitle: "Inception(2010)",
        director:"Christopher Nolan",
        movieRelease:"July 16, 2010",
        genre: "Sci-Fi", // Sci-Fi is science fiction
        directorDOB: "July 30, 1970",
        directorPOB: "London, England",   
        directorDOD: "N/A", 
        movieInfo:"Dom Cobb is a thief with the rare ability to enter people's dreams and steal their secrets from their subconscious. He is charged with the task of planting an idea in someone's mind. Will he succeed?"
    },
    {
        movieTitle: "Spider-Man: Into the Spider-Verse (2018)",
        director:"Peter Ramsey",
        movieRelease:"December 14, 2018",
        genre: "Adventure",
        directorDOB: "December 23, 1962",
        directorPOB: "Crenshaw, California",   
        directorDOD: "N/A", 
        movieInfo:"A 2018 American computer-animated super hero film featuring the Marvel Comics character, Spider-Man."
    },
    {
        movieTitle: "The Godfather (1972)",
        director:"Francis Ford Coppola",
        movieRelease:"March 15, 1972",
        genre: "Drama",
        directorDOB: "April 7, 1939",
        directorPOB: "Detroit, Michigan",   
        directorDOD: "N/A", 
        movieInfo:"Highly regarded as one of the greatest films of all time, this movie focuses on the powerful Italian American crime family of Don Vito Corleone. His son relectantly joins the mafia and gets caught in violence and betrayal."
    },
    {
        movieTitle: "The Lion King(1994)",
        director:"Rob Minkoff",
        movieRelease:"June 24, 1994",
        genre: "Animation",
        directorDOB: "August 11, 1962",
        directorPOB: "Palo Alto, California",   
        directorDOD: "N/A", 
        movieInfo:"A Disney animated feature follows the adventures of the young lion, Simba, the heir of his father, Mufasa. Simba's father is killed by a stampede, but Simba's uncle Scar was behind his father's death. Now an adult, Simba returns home to take back his homeland."
    },
    {
        movieTitle: "The Shining(1980)",
        director:"Stanley Kubrick",
        movieRelease:"May 23, 1980",
        genre: "Thriller",
        directorDOB: "July, 26, 1928",
        directorPOB: "Bronx, New York",   
        directorDOD: "N/A", 
        movieInfo:"A murderer is hell bent on terrorizing Jack Torrance's family as a hotel's dark secrets unravel."
    },
    {
        movieTitle: "The Wizard Of Oz (1939)",
        director:"Victor Fleming",
        movieRelease:"August 25, 1939",
        genre: "Musical",
        directorDOB: "February 23, 1889",
        directorPOB: "La Canada, California",   
        directorDOD: "January 6, 1949",
        directorPOD:"Cottonwood, Arizona", //POD-director's place of death 
        movieInfo:"When a cyclone hits, Dorothy is swallowed up by the cyclone and wakes up in the Land of Oz. She follows the Yellow Brick Road to meet the Wizard of Oz meeting many along the way."
    },
    {
      movieTitle: "Gone With The Wind (1939)",
      director:"Victor Fleming",
      movieRelease:"August 25, 1939",
      genre: "Drama",
      directorDOB: "February 23, 1889",
      directorPOB: "La Canada, California",   
      directorDOD: "January 6, 1949",
      directorPOD:"Cottonwood, Arizona", 
      movieInfo:"When a cyclone hits, Dorothy is swallowed up by the cyclone and wakes up in the Land of Oz. She follows the Yellow Brick Road to meet the Wizard of Oz meeting many along the way."
  },
     
]

const users = [{}];

const bodyParser = require("body-parser"),
  methodOverride = require("method-override");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

// //returns list of all movies

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
