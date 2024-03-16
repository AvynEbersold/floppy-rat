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
app.enable('trust proxy')

// use heroku automated certificate management?

var options = {
	key: fs.readFileSync("privatekey.pem", "utf8"),
	cert: fs.readFileSync("floppyrat_com.crt", "utf8"),
};

let port = process.env.PORT || 3000;

function isMobile(req) {
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(req.headers["user-agent"])) {
	return true;
  } else {
	return false;
  }
}

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

app.get("*", (req, res, next) => {
	if(req.protocol != "https"){
		console.log(req.protocol);
		res.redirect("https://www.floppyrat.com");
	} else {
		next();
	}
})

app.get("/", (req, res) => {
	if(!isMobile(req)){
		res.sendFile(__dirname + "/public/home.html");
	} else {
		res.sendFile(__dirname + "/public/mobile.html");
	}
});

app.listen(port, (err) => {
	console.log(err ? err : "listening on port " + port);
});