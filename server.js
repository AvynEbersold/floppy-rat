var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();
app.use(express.static('public'));

const port = process.env.PORT || 80;

app.use(function(req, res, next) {
	if (process.env.NODE_ENV != 'development' && !req.secure) {
	   return res.redirect("https://" + req.headers.host + req.url);
	}
	next();
})

app.get("/", (req, res)=>{
	res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, (err)=>{
	console.log(err ? err : "Server running on port " + port);
});