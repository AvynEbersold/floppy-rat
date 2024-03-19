var express = require("express");
var bodyParser = require('body-parser')
var https = require("https");
var http = require("http");
var fs = require("fs");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
app.use(express.static("public"));
app.enable("trust proxy");

app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json());

let port = process.env.PORT || 3000;

// mobile redirect *might* not be a good idea b/c Gsearch crawlers get redirected too
function isMobile(req) {
	if (
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
			req.headers["user-agent"],
		)
	) {
		return true;
	} else {
		return false;
	}
}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/");
	}
}

//USE COOKIES WITH ENCRYPTION KEY
const secret = process.env.SESSION_SECRET;

// use this:
// https://medium.com/@mohan.velegacherla/how-to-setup-passport-authentication-in-node-js-with-example-using-express-js-bf44a51e8ca0

// Use session middleware
app.use(
	session({
		secret: "testing secret",
		resave: false,
		saveUninitialized: false,
	}),
);
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

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

const users = [{ id: 1, username: "user", password: "password" }];

passport.use(
	new LocalStrategy((username, password, done) => {
		const user = users.find((u) => u.username === username);
		if (!user) {
			return done(null, false, { message: "Incorrect username." });
		}
		if (user.password !== password) {
			return done(null, false, { message: "Incorrect password." });
		}
		return done(null, user);
	}),
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	const user = users.find((u) => u.id === id);
	done(null, user);
});

app.get("*", (req, res, next) => {
	if (req.protocol != "https") {
		console.log(req.protocol);
		res.redirect("https://www.floppyrat.com" + req.url);
	} else {
		next();
	}
});

app.get("/", (req, res) => {
	if (!isMobile(req)) {
		res.sendFile(__dirname + "/public/home.html");
	} else {
		res.sendFile(__dirname + "/public/mobile.html");
	}
});

app.get("/account", ensureAuthenticated, (req, res) => {
	res.send("your account page");
});

app.get("/mobile", (req, res) => {
	// testing route for if people REALLY want to try the game on mobile
	res.sendFile(__dirname + "/public/home.html");
});

app.post("/auth", (req, res) => {
	console.log("trying to authenticate");
	console.log(req.body.username);
	console.log(req.body.password);
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/",
		failureFlash: true,
	});
});

app.listen(port, (err) => {
	console.log(err ? err : "listening on port " + port);
});
