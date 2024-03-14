var express = require("express");
var https = require("https");
var http = require("http");
var fs = require("fs");
const app = express();
app.use(express.static("public"));

// use heroku automated certificate management?

var options = {
	key: fs.readFileSync("privatekey.pem", "utf8"),
	cert: fs.readFileSync("floppyrat_com.crt", "utf8"),
};

let port = process.env.PORT || 3000;

app.use(function (req, res, next) {
	if (process.env.NODE_ENV != "development" && !req.secure) {
		return res.redirect("https://" + req.headers.host + req.url);
	}
	next();
});

app.get("/", (req, res) => {
	console.log("requested");
	res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, (err) => {
	console.log(err ? err : "listening on port " + port);
});
