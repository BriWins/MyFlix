---------------------------Importing Mongoose-------------------------------- 

const mongoose = require("mongoose");

---------------------------Movie Schema-------------------------------- 

let movieSchema = mongoose.Schema({
    Title: { type: String, required: true},
    Description: {type: String, required: true},
    Featured:Boolean,
    ImgPath: String,
    Rating: String,
    ReleaseDate: Date,
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Biography: String,
        Birthdate: Date,
        Birthplace: String,
        Deathplace: String
    },
    Actors: [String]
});

---------------------------User Schema-------------------------------- 

let userSchema = mongoose.Schema({
    Username: String,
    Password: String,
    Email: String,
    Birthdate: Date,
    Favorites: [String]
});

---------------------------Hashing Passwords-------------------------------- 

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password,10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

---------------------------Exportation-------------------------------- 

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;


