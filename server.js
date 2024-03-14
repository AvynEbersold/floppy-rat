var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
const app = express();
app.use(express.static('public'));

var options = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('floppyrat_com.crt')
};

const port = process.env.PORT || 443;

app.use(function(req, res, next) {
	if (process.env.NODE_ENV != 'development' && !req.secure) {
	   return res.redirect("https://" + req.headers.host + req.url);
	}
	next();
})

app.get("/", (req, res)=>{
	console.log("requested");
	res.sendFile(__dirname + "/public/index.html");
});

http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);