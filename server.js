var express = require("express");
var https = require("https");
var http = require("http");
var fs = require("fs");
// const mongoose = require('mongoose');
// const session = require('express-session');
// const passport = require('passport');
// const passportLocalMongoose = require('passport-local-mongoose');

const app = express();
app.use(express.static("public"));
app.enable("trust proxy");

// use heroku automated certificate management?

var options = {
	key: fs.readFileSync("privatekey.pem", "utf8"),
	cert: fs.readFileSync("floppyrat_com.crt", "utf8"),
};

let port = process.env.PORT || 3000;

//USE COOKIES WITH ENCRYPTION KEY
// const secret = process.env.SESSION_SECRET;
// app.use(
// 	session({
// 		secret: secret,
// 		resave: false,
// 		saveUninitialized: false,
// 	})
// );
// app.use(passport.initialize());
// app.use(passport.session());

//CONNECT TO MONGODB DATABASE

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
// const key = process.env.DB_SECRET;
// mongoose.connect('mongodb+srv://avynebersold:' + key + '@floppy-rat-database.cpcyqk5.mongodb.net/?retryWrites=true&w=majority&appName=floppy-rat-database');

// const userSchema = new mongoose.Schema({
// 	username: String,
// 	password: String,
// 	highscore: Number,
// });

// const leaderboardSchema = new mongoose.Schema({
// 	scores: [{
// 		player: String,
// 		score: Number,
// 		timeCompleted: Date,
// 	}]
// });

app.use((req, res, next) => {
	if(req.secure){
		next();
	} else {
		res.redirect('https://www.floppyrat.com' + req.url);
	}
});

app.get("/", (req, res) => {
	console.log("requested");
	res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, (err) => {
	console.log(err ? err : "listening on port " + port);
});
