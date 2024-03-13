const express = require("express");
const app = express();
app.use(express.static('public'));

const port = process.env.PORT || 80;

app.use(function(req, res, next) {
	if (process.env.NODE_ENV != 'development' && req.secure) {
	   return res.redirect("http://" + req.headers.host + req.url);
	}
	next();
})

app.get("/", (req, res)=>{
	console.log("requested");
	res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, function(error) {
	console.log(error ? error : "Server running on port " + port);
});